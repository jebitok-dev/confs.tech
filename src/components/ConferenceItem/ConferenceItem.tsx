import React, { PureComponent } from 'react'
import classNames from 'classnames'

import { formatDate, generateEventJSONLD } from './utils'
import Heading from '../Heading'
import Link from '../Link'
import styles from './ConferenceItem.scss'

interface Props {
  showCFP: boolean
}

export default class ConferenceItem extends PureComponent<Props & Conference> {
  render() {
    const {
      name,
      topics,
      url,
      city,
      country,
      online,
      startDate,
      endDate,
      twitter,
      cfpEndDate,
      cfpUrl,
      showCFP,
      affiliateText,
      affiliateUrl,
      offersSignLanguageOrCC,
      cocUrl,
    } = this.props

    return (
      <div
        className={classNames(styles.ConferenceItem)}
        id={idify(name, startDate)}
      >
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: generateEventJSONLD({
              name,
              url,
              city,
              country,
              startDate,
              endDate,
            }),
          }}
        />
        <Heading element='p' level={4}>
          <Link onClick={this.trackLink} url={url} external>
            {name}
          </Link>
        </Heading>
        <p className={styles.p}>
          {`${Location(city, country, online)}・`}
          <span className={styles.Date}>{formatDate(startDate, endDate)}</span>
        </p>
        {offersSignLanguageOrCC && (
          <p className={styles.p}>
            Offers interpretation to International sign language or closed
            captions.
          </p>
        )}
        <p className={classNames(styles.p, styles.Footer)}>
          {showCFP && <Cfp url={cfpUrl || url} date={cfpEndDate} />}
          {showCFP && <br />}
          <Topics topics={topics} />
          <Twitter twitter={twitter} />
          {cocUrl && (
            <>
              ・
              <Link url={cocUrl} external>
                Code Of Conduct
              </Link>
            </>
          )}
          <Affiliate
            text={affiliateText}
            url={affiliateUrl}
            callback={this.trackAffiliate}
          />
        </p>
      </div>
    )
  }

  private trackAffiliate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const { href } = event.currentTarget
    this.track('outbound-affiliate', href)
  }

  private trackLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const { href } = event.currentTarget
    this.track('outbound', href)
  }

  private track = (eventName: string, url: string) => {
    ga('send', 'event', eventName, 'click', url, {
      transport: 'beacon',
    })
  }
}

interface TwitterProps {
  twitter: string
}
function Twitter({ twitter }: TwitterProps) {
  if (!twitter) {
    return null
  }

  return (
    <>
      ・
      <Link url={`https://twitter.com/${twitter}`} external>
        {twitter}
      </Link>
    </>
  )
}

function Location(city: string, country: string, online: boolean) {
  switch (true) {
    case online && !city:
      return 'Online'
    case online && city !== null:
      return `${city}, ${country} & Online`
    default:
      return `${city}, ${country}`
  }
}

interface CfpProps {
  url: string
  date: string
}

function Cfp({ url, date }: CfpProps) {
  return (
    <Link url={url} external className={styles.cfp}>
      CFP closes {formatDate(date)}
    </Link>
  )
}

interface TopicsProps {
  topics: string[]
}

function Topics({ topics }: TopicsProps) {
  return <>{topics.map((topic) => `#${topic}`).join(' ')}</>
}

function idify(conferenceName: string, startDate: string) {
  return `${conferenceName.toLocaleLowerCase().replace(/ /g, '-')}-${startDate}`
}

interface AffiliateProps {
  url: string
  text: string
  callback: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

function Affiliate({ url, text, callback }: AffiliateProps) {
  if (!url) {
    return null
  }

  return (
    <>
      ・
      <Link onClick={callback} url={url} external>
        <span className={styles.promocode}>{text}</span>
      </Link>
    </>
  )
}
