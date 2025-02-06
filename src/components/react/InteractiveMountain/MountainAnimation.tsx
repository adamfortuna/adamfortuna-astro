import { useEffect } from 'react'
import { gsap } from 'gsap'

const CLASS_PREFIX = ''

export default function MountainAnimation({ children }: {children: React.ReactElement }) {
  function mountainClouds() {
    const mountainCloudsTimeline = gsap.timeline()
    mountainCloudsTimeline.to(
      `.${CLASS_PREFIX}mountain__clouds`,
      {
        y: '-=10',
        duration: 3.5,
        yoyo: true,
        repeat: -1,
      },
      'start',
    )
    return mountainCloudsTimeline
  }

  function cloud1() {
    const cloud1Timeline = gsap.timeline({ defaults: { ease: 'linear' } })
    cloud1Timeline
      .to(`.${CLASS_PREFIX}mountain__cloud1`, {
        x: 760,
        duration: 50,
      })
      .fromTo(
        `.${CLASS_PREFIX}mountain__cloud1`,
        {
          x: -200,
        },
        {
          x: 760,
          duration: 70,
          repeat: -1,
          immediateRender: false,
        },
      )

    return cloud1Timeline
  }

  function cloud2() {
    const cloud2Timeline = gsap.timeline()
    cloud2Timeline.to(`.${CLASS_PREFIX}mountain__cloud2`, {
      y: '-=10',
      duration: 4.5,
      yoyo: true,
      repeat: -1,
    })
    return cloud2Timeline
  }

  function cloud3() {
    const cloud3Timeline = gsap.timeline({ defaults: { ease: 'linear' } })
    cloud3Timeline.to(`.${CLASS_PREFIX}mountain__cloud3`, {
      x: 760,
      duration: 30,
    })
    cloud3Timeline.fromTo(
      `.${CLASS_PREFIX}mountain__cloud3`,
      {
        x: -200,
      },
      {
        x: 760,
        duration: 90,
        repeat: -1,
        immediateRender: false,
      },
    )
    return cloud3Timeline
  }

  function breeze() {
    const breezeTimeline = gsap.timeline()
    // Todo: Figure out how to order these
    breezeTimeline.to(`.${CLASS_PREFIX}mountain__tree`, {
      duration: 1,
      repeat: -1,
      yoyo: true,
      repeatDelay: 4,
      stagger: 0.1,
      transformOrigin: '100% 50%',
      skewType: 'simple',
      skewX: -5,
    })

    breezeTimeline.to(
      `.${CLASS_PREFIX}mountain__bottom-left`,
      {
        duration: 1,
        repeat: -1,
        yoyo: true,
        repeatDelay: 4,
        transformOrigin: '100% 50%',
        skewType: 'simple',
        skewX: -15,
      },
      '>',
    )

    return breezeTimeline
  }

  function startBackgroundAnimations() {
    const main = gsap.timeline()
    main.add(mountainClouds(), 0)
        .add(cloud1(), 0)
        .add(cloud2(), 0)
        .add(cloud3(), 0)
        .add(breeze(), 0)
  }


  useEffect(() => {
    setTimeout(() => {
      startBackgroundAnimations()
    }, 1000)
  }, [])

  return (
    <div className="mountain-animation">{children}</div>
  )
}
