import Link from 'next/link'
import Date from '../components/date'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import { GetStaticProps } from 'next'
import { GitHub } from 'react-feather'

interface Props {
  allPostsData: {
    date: string
    title: string
    id: string
  }[]
}

export default function Home({ allPostsData }: Props) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hi! I'm Regina.</p>
        <p>
          I'm a software engineer at{' '}
          <a href="https://www.keplergrp.com/">Kepler Group</a> in New York
          City.
        </p>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Experience</h2>
          <ul>
            <li>
              Computer Science @
              <a href="https://www.upenn.edu/">University of Pennsylvania</a>
            </li>
            <li>
              Roadtripper with @
              <a href="https://roadtripnation.com/roadtrip/women-in-stem">
                RoadTrip Nation
              </a>
            </li>
            <li>
              Global Information Security Analyst @
              <a href="https://www.citigroup.com/citi/">Citi</a>
            </li>
            <li>
              Student @<a href="https://girlswhocode.com/">Girls Who Code</a>
            </li>
          </ul>
        </section>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}
