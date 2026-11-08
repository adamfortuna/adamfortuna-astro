import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import timelineData from '@/data/code-timeline.json'

/**
 * CodeTimeline
 *
 * A multi-lane vertical timeline of the tools I've used to write software:
 * operating systems, editors, languages, hosting and so on. Time runs top to
 * bottom; every lane packs its (possibly overlapping) items into side-by-side
 * columns so a single bar always represents one tool.
 *
 * Hovering (or tapping) anywhere on the chart draws a horizontal "moment" line
 * and lists what was in use at that date. Clicking pins the moment in place;
 * the slider above the chart does the same thing from the keyboard.
 *
 * The data lives in src/data/code-timeline.json. Embed in a WordPress post with
 * `<CodeTimeline />` (see src/lib/articleEmbeds.ts).
 */

export type LaneColor = 'blue' | 'orange' | 'aqua' | 'yellow' | 'magenta' | 'violet'

export interface TimelineItemData {
  name: string
  /** "YYYY" or "YYYY-MM" */
  start: string
  /** "YYYY", "YYYY-MM" or "now". Years and months are inclusive. */
  end: string
  note?: string
}

export interface TimelineLaneData {
  id: string
  name: string
  short: string
  color: LaneColor
  items: TimelineItemData[]
}

export interface CodeTimelineData {
  /** First year on the axis, "YYYY" */
  start: string
  lanes: TimelineLaneData[]
}

interface PositionedItem {
  key: string
  name: string
  note?: string
  start: number
  /** Exclusive end (ms). For ongoing items this is `today`. */
  end: number
  ongoing: boolean
  column: number
  startLabel: string
  endLabel: string
}

interface PositionedLane {
  id: string
  name: string
  short: string
  color: LaneColor
  columns: number
  items: PositionedItem[]
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000
const PX_PER_YEAR = 28
const AXIS_WIDTH = 44
const COLUMN_MIN_WIDTH = 16
const LANE_GAP = 10
const CARD_WIDTH = 260
const CARD_HEIGHT_ESTIMATE = 320
const BIRTHDATE = Date.UTC(1982, 4, 18)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseDateParts(value: string) {
  const [year, month] = value.split('-').map(Number)
  return { year, month: Number.isFinite(month) ? month : undefined }
}

function parseStart(value: string) {
  const { year, month } = parseDateParts(value)
  return Date.UTC(year, (month ?? 1) - 1, 1)
}

/** Inclusive year/month → exclusive timestamp (first instant after the period). */
function parseEnd(value: string) {
  const { year, month } = parseDateParts(value)
  return month ? Date.UTC(year, month, 1) : Date.UTC(year + 1, 0, 1)
}

function formatPeriod(value: string) {
  if (value === 'now') return 'now'
  const { year, month } = parseDateParts(value)
  return month ? `${MONTHS[month - 1]} ${year}` : `${year}`
}

function formatMoment(time: number) {
  const date = new Date(time)
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

function ageAt(time: number) {
  return Math.floor((time - BIRTHDATE) / MS_PER_YEAR)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * First-fit column packing. Longest-lived items are placed first so the
 * things I've stuck with for decades sit in the leftmost columns of a lane and
 * the short experiments fill in to the right.
 */
function layoutLane(lane: TimelineLaneData, today: number): PositionedLane {
  const parsed = lane.items.map((item, index) => {
    const ongoing = item.end === 'now'
    const start = parseStart(item.start)
    const end = ongoing ? today : parseEnd(item.end)
    return {
      key: `${lane.id}-${index}`,
      name: item.name,
      note: item.note,
      start,
      end: Math.max(end, start),
      ongoing,
      startLabel: formatPeriod(item.start),
      endLabel: formatPeriod(item.end),
      column: 0,
    }
  })

  const order = [...parsed].sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start)
  const columnEnds: number[] = []
  for (const item of order) {
    let column = columnEnds.findIndex((columnEnd) => columnEnd <= item.start)
    if (column === -1) {
      column = columnEnds.length
      columnEnds.push(0)
    }
    item.column = column
    columnEnds[column] = item.end
  }

  return {
    id: lane.id,
    name: lane.name,
    short: lane.short,
    color: lane.color,
    columns: Math.max(1, columnEnds.length),
    items: parsed,
  }
}

function isActive(item: PositionedItem, time: number) {
  return item.start <= time && (item.ongoing || time < item.end)
}

function laneStyle(lane: PositionedLane) {
  return {
    flexGrow: lane.columns,
    flexBasis: 0,
    minWidth: lane.columns * COLUMN_MIN_WIDTH,
  }
}

interface Moment {
  time: number
  /** Pointer x within the chart, when the moment came from the pointer. */
  x: number | null
}

export interface CodeTimelineProps {
  /** ISO date (YYYY-MM-DD) used as "now". Defaults to the current date. */
  today?: string
  data?: CodeTimelineData
}

export const CodeTimeline = ({ today: todayProp, data = timelineData as CodeTimelineData }: CodeTimelineProps) => {
  const today = useMemo(() => {
    const date = todayProp ? new Date(todayProp) : new Date()
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  }, [todayProp])

  const startYear = Number(data.start)
  const endYear = new Date(today).getUTCFullYear() + 1
  const axisStart = Date.UTC(startYear, 0, 1)
  const axisEnd = Date.UTC(endYear, 0, 1)
  const axisSpan = axisEnd - axisStart
  const chartHeight = (endYear - startYear) * PX_PER_YEAR

  const lanes = useMemo(() => data.lanes.map((lane) => layoutLane(lane, today)), [data, today])
  const minWidth =
    AXIS_WIDTH +
    lanes.reduce((sum, lane) => sum + lane.columns * COLUMN_MIN_WIDTH, 0) +
    (lanes.length - 1) * LANE_GAP

  const years = useMemo(() => {
    const list: number[] = []
    for (let year = startYear; year <= endYear; year += 1) list.push(year)
    return list
  }, [startYear, endYear])

  const chartRef = useRef<HTMLDivElement>(null)
  const [moment, setMoment] = useState<Moment | null>(null)
  const [pinned, setPinned] = useState(false)
  const [chartWidth, setChartWidth] = useState(0)

  const fractionFor = useCallback((time: number) => (time - axisStart) / axisSpan, [axisStart, axisSpan])
  const yFor = useCallback((time: number) => fractionFor(time) * chartHeight, [fractionFor, chartHeight])

  const momentFromPointer = useCallback(
    (event: { clientX: number; clientY: number }): Moment | null => {
      const chart = chartRef.current
      if (!chart) return null
      const rect = chart.getBoundingClientRect()
      const fraction = clamp((event.clientY - rect.top) / rect.height, 0, 1)
      return {
        time: clamp(axisStart + fraction * axisSpan, axisStart, today),
        x: clamp(event.clientX - rect.left, 0, rect.width),
      }
    },
    [axisStart, axisSpan, today],
  )

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return undefined
    const update = () => setChartWidth(chart.getBoundingClientRect().width)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(chart)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!pinned) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPinned(false)
        setMoment(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pinned])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    // Touch "moves" are scrolls; taps come through onClick and pin instead.
    if (pinned || event.pointerType === 'touch') return
    const next = momentFromPointer(event)
    if (next) setMoment(next)
  }

  const handlePointerLeave = () => {
    if (!pinned) setMoment(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (pinned) {
      setPinned(false)
      const next = momentFromPointer(event)
      setMoment(next)
      return
    }
    const next = momentFromPointer(event)
    if (next) {
      setMoment(next)
      setPinned(true)
    }
  }

  const clearMoment = () => {
    setPinned(false)
    setMoment(null)
  }

  // Slider: one step per month from the first year on the axis through today.
  const todayDate = new Date(today)
  const totalMonths = (todayDate.getUTCFullYear() - startYear) * 12 + todayDate.getUTCMonth()
  const sliderValue = moment
    ? (new Date(moment.time).getUTCFullYear() - startYear) * 12 + new Date(moment.time).getUTCMonth()
    : totalMonths
  const handleSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
    const months = Number(event.target.value)
    const time = Math.min(Date.UTC(startYear + Math.floor(months / 12), months % 12, 15), today)
    setMoment({ time, x: null })
    setPinned(true)
  }

  const momentY = moment ? yFor(moment.time) : 0
  const cardBelow = momentY < chartHeight - CARD_HEIGHT_ESTIMATE
  const cardLeft = (() => {
    if (!moment) return AXIS_WIDTH + 8
    const width = chartWidth || CARD_WIDTH * 2
    const pointerX = moment.x ?? width
    const preferRight = pointerX < width / 2
    const left = preferRight ? pointerX + 16 : pointerX - 16 - CARD_WIDTH
    return clamp(left, AXIS_WIDTH, Math.max(AXIS_WIDTH, width - CARD_WIDTH))
  })()

  return (
    <figure className="code-timeline not-prose my-10 mx-auto max-w-3xl px-3 md:px-0 font-sans text-gray-900 dark:text-gray-100">
      {/* Legend */}
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-3">
        {lanes.map((lane) => (
          <li key={lane.id} className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: `var(--ct-${lane.color})` }} />
            <span className="text-gray-700 dark:text-gray-300">{lane.name}</span>
          </li>
        ))}
      </ul>

      {/* Moment picker (keyboard + touch friendly) */}
      <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
        <label htmlFor="code-timeline-moment" className="font-semibold">
          Jump to
        </label>
        <input
          id="code-timeline-moment"
          type="range"
          min={0}
          max={totalMonths}
          step={1}
          value={sliderValue}
          onChange={handleSlider}
          className="order-last w-full sm:order-none sm:w-auto sm:flex-1 accent-blue-600"
          aria-valuetext={moment ? formatMoment(moment.time) : 'now'}
        />
        <output htmlFor="code-timeline-moment" className="tabular-nums font-semibold w-20 ml-auto sm:ml-0">
          {moment ? formatMoment(moment.time) : 'Now'}
        </output>
        <button
          type="button"
          onClick={clearMoment}
          disabled={!moment}
          className="text-xs font-semibold px-2 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth }}>
        {/* Lane headers – same flex geometry as the lanes below so they line up */}
        <div className="flex" style={{ paddingLeft: AXIS_WIDTH, gap: LANE_GAP }}>
          {lanes.map((lane) => (
            <div
              key={lane.id}
              style={laneStyle(lane)}
              className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 leading-tight flex items-end border-b-2 pb-1 mb-2"
              title={lane.name}
            >
              <span className="inline-block shrink-0 w-2 h-2 rounded-sm mr-1 mb-0.5" style={{ background: `var(--ct-${lane.color})` }} />
              <span className="truncate" title={lane.name}>{lane.short}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div
          ref={chartRef}
          className={clsx('relative select-none', pinned ? 'cursor-pointer' : 'cursor-crosshair')}
          style={{ height: chartHeight }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          {/* Year grid */}
          {years.map((year) => {
            const y = yFor(Date.UTC(year, 0, 1))
            const major = year % 5 === 0
            return (
              <div key={year} className="absolute left-0 right-0 pointer-events-none" style={{ top: y }}>
                <div
                  className={clsx(
                    'absolute right-0 border-t',
                    major ? 'left-0 border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800',
                  )}
                  style={major ? undefined : { left: AXIS_WIDTH - 6, width: 6, right: 'auto' }}
                />
                {major && (
                  <span
                    className="absolute -translate-y-1/2 text-[11px] tabular-nums text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 pr-1"
                    style={{ left: 0 }}
                  >
                    {year}
                  </span>
                )}
              </div>
            )
          })}

          {/* Today */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-gray-400 dark:border-gray-500 pointer-events-none"
            style={{ top: yFor(today) }}
          >
            <span className="absolute left-0 -translate-y-1/2 text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-900 pr-1">
              Now
            </span>
          </div>

          {/* Lanes */}
          <div className="absolute inset-y-0 right-0 flex" style={{ left: AXIS_WIDTH, gap: LANE_GAP }}>
            {lanes.map((lane) => (
              <div key={lane.id} style={laneStyle(lane)} className="relative flex h-full">
                {Array.from({ length: lane.columns }, (_, column) => (
                  <div key={column} className="relative flex-1 h-full">
                    {lane.items
                      .filter((item) => item.column === column)
                      .map((item) => {
                        const top = yFor(item.start)
                        const height = Math.max(yFor(item.end) - top, 6)
                        const active = moment ? isActive(item, moment.time) : null
                        const labelFits = height >= item.name.length * 6.4 + 14
                        return (
                          <div
                            key={item.key}
                            className={clsx(
                              'absolute inset-x-px rounded-[4px] overflow-hidden transition-opacity duration-150',
                              active === false && 'opacity-25',
                              active === true && 'ring-2 ring-white dark:ring-slate-900',
                              item.ongoing && 'rounded-b-none',
                            )}
                            style={{
                              top,
                              height,
                              background: `var(--ct-${lane.color})`,
                              color: `var(--ct-${lane.color}-ink)`,
                            }}
                            title={`${item.name} · ${item.startLabel} – ${item.endLabel}${item.note ? ` · ${item.note}` : ''}`}
                          >
                            {labelFits && (
                              <span
                                className="absolute inset-0 flex items-center justify-start pt-2 text-[11px] font-semibold leading-none whitespace-nowrap"
                                style={{ writingMode: 'vertical-rl' }}
                              >
                                {item.name}
                              </span>
                            )}
                          </div>
                        )
                      })}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Moment line */}
          {moment && (
            <div
              className="absolute left-0 right-0 pointer-events-none border-t-2 border-gray-900 dark:border-gray-100"
              style={{ top: momentY }}
            >
              <span className="absolute left-0 -translate-y-1/2 text-[11px] font-bold tabular-nums bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded px-1 py-0.5 whitespace-nowrap">
                {formatMoment(moment.time)}
              </span>
            </div>
          )}

          {/* Moment card */}
          {moment && (
            <div
              role="status"
              className="absolute z-10 pointer-events-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur text-left text-sm p-3"
              style={{
                width: CARD_WIDTH,
                left: cardLeft,
                ...(cardBelow ? { top: momentY + 12 } : { bottom: chartHeight - momentY + 12 }),
              }}
            >
              <p className="font-bold text-base leading-tight">
                {formatMoment(moment.time)}
                <span className="ml-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {ageAt(moment.time)} years old
                </span>
              </p>
              <dl className="mt-2 space-y-1.5">
                {lanes.map((lane) => {
                  const active = lane.items.filter((item) => isActive(item, moment.time))
                  return (
                    <div key={lane.id} className="flex gap-2">
                      <dt className="shrink-0 w-20 whitespace-nowrap text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 leading-5">
                        <span
                          className="inline-block w-2 h-2 rounded-sm mr-1 align-middle"
                          style={{ background: `var(--ct-${lane.color})` }}
                        />
                        {lane.short}
                      </dt>
                      <dd className="leading-5 text-gray-900 dark:text-gray-100">
                        {active.length === 0 ? (
                          <span className="text-gray-400 dark:text-gray-500">—</span>
                        ) : (
                          active.map((item, index) => (
                            <span key={item.key}>
                              {index > 0 && ', '}
                              <strong className="font-semibold">{item.name}</strong>
                            </span>
                          ))
                        )}
                      </dd>
                    </div>
                  )
                })}
              </dl>
              <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                {pinned ? 'Pinned · click or press Esc to release' : 'Click to pin this moment'}
              </p>
            </div>
          )}
        </div>
        </div>
      </div>

      <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Hover or tap anywhere on the timeline to see what I was using at that moment. Click to pin it.
      </figcaption>

      {/* Table view – the same data without needing a pointer */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold text-blue-700 dark:text-sky-300">View as a table</summary>
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-1 pr-2 font-semibold">Lane</th>
              <th className="py-1 pr-2 font-semibold">Tool</th>
              <th className="py-1 pr-2 font-semibold">From</th>
              <th className="py-1 pr-2 font-semibold">To</th>
              <th className="py-1 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {lanes.flatMap((lane) =>
              [...lane.items]
                .sort((a, b) => a.start - b.start)
                .map((item) => (
                  <tr key={item.key} className="border-b border-gray-100 dark:border-gray-800 align-top">
                    <td className="py-1 pr-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{lane.name}</td>
                    <td className="py-1 pr-2 font-semibold">{item.name}</td>
                    <td className="py-1 pr-2 tabular-nums whitespace-nowrap">{item.startLabel}</td>
                    <td className="py-1 pr-2 tabular-nums whitespace-nowrap">{item.endLabel}</td>
                    <td className="py-1 text-gray-500 dark:text-gray-400">{item.note ?? ''}</td>
                  </tr>
                )),
            )}
          </tbody>
        </table>
      </details>
    </figure>
  )
}

export default CodeTimeline
