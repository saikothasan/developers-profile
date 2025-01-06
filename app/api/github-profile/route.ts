import { NextResponse } from 'next/server'

const GITHUB_API_URL = 'https://api.github.com'

async function fetchGithubData(username: string) {
  const [userResponse, reposResponse, eventsResponse] = await Promise.all([
    fetch(`${GITHUB_API_URL}/users/${username}`),
    fetch(`${GITHUB_API_URL}/users/${username}/repos?per_page=100&sort=updated`),
    fetch(`${GITHUB_API_URL}/users/${username}/events?per_page=100`)
  ])

  const userData = await userResponse.json()
  const reposData = await reposResponse.json()
  const eventsData = await eventsResponse.json()

  // Calculate commit count and PR count from events
  const commitCount = eventsData.filter((event: any) => event.type === 'PushEvent').reduce((acc: number, event: any) => acc + event.payload.commits.length, 0)
  const prCount = eventsData.filter((event: any) => event.type === 'PullRequestEvent').length

  // Calculate top languages, total star count, and top repos
  const languageCounts: {[key: string]: number} = {}
  let starCount = 0
  const repoStats = reposData.map((repo: any) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
    }
    starCount += repo.stargazers_count
    return {
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count
    }
  })
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, level: Math.round((count / reposData.length) * 100) }))
  const topRepos = repoStats.sort((a, b) => b.stars - a.stars).slice(0, 5)

  // Calculate contributions in the last year (approximate)
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const contributionsLastYear = eventsData.filter((event: any) => new Date(event.created_at) > oneYearAgo).length

  return {
    name: userData.name || userData.login,
    avatarUrl: userData.avatar_url,
    bio: userData.bio,
    company: userData.company,
    location: userData.location,
    publicRepos: userData.public_repos,
    followers: userData.followers,
    following: userData.following,
    createdAt: userData.created_at,
    topLanguages,
    commitCount,
    prCount,
    repoCount: reposData.length,
    starCount,
    contributionsLastYear,
    topRepos
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    const data = await fetchGithubData(username)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 })
  }
}

