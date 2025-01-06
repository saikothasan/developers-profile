'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Code, GitBranch, GitPullRequest, Users, MapPin, Building, Calendar, Star, Activity, Folder, Eye } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts'

interface DevProfile {
  name: string
  avatarUrl: string
  bio: string
  company: string
  location: string
  publicRepos: number
  followers: number
  following: number
  createdAt: string
  topLanguages: { name: string; level: number }[]
  commitCount: number
  prCount: number
  repoCount: number
  starCount: number
  contributionsLastYear: number
  topRepos: { name: string; stars: number; forks: number; watchers: number }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function DevOpsProfileCard({ username }: { username: string }) {
  const [profile, setProfile] = useState<DevProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/github-profile?username=${username}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching profile:', err)
        setLoading(false)
      })
  }, [username])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return <div>Failed to load profile</div>
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <Card className="w-full overflow-hidden backdrop-blur-xl bg-white/80 border-none shadow-lg">
          <CardHeader className="relative">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-4xl font-bold text-primary">{profile.name}</h1>
                <p className="text-xl text-muted-foreground mt-2">{profile.bio}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  {profile.company && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {profile.company}
                    </Badge>
                  )}
                  {profile.location && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {profile.location}
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="languages">Languages</TabsTrigger>
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
                <TabsTrigger value="repositories">Top Repos</TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <TabsContent value="overview" className="mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  >
                    <DevMetric icon={Code} value={profile.repoCount} label="Repositories" />
                    <DevMetric icon={GitBranch} value={profile.commitCount} label="Commits" />
                    <DevMetric icon={GitPullRequest} value={profile.prCount} label="Pull Requests" />
                    <DevMetric icon={Users} value={profile.followers} label="Followers" />
                    <DevMetric icon={Star} value={profile.starCount} label="Total Stars" />
                    <DevMetric icon={Activity} value={profile.following} label="Following" />
                    <DevMetric icon={Folder} value={profile.publicRepos} label="Public Repos" />
                    <DevMetric icon={Eye} value={profile.contributionsLastYear} label="Contributions (Last Year)" />
                  </motion.div>
                </TabsContent>
                <TabsContent value="languages" className="mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <div className="space-y-3">
                      {profile.topLanguages.map((lang, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <Badge variant="outline" className="w-24 justify-center">
                            {lang.name}
                          </Badge>
                          <Progress value={lang.level} className="flex-grow" />
                          <span className="text-xs text-muted-foreground">{lang.level}%</span>
                        </motion.div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={profile.topLanguages}
                          dataKey="level"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        >
                          {profile.topLanguages.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>
                <TabsContent value="contributions" className="mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Commits', value: profile.commitCount },
                        { name: 'PRs', value: profile.prCount },
                        { name: 'Contributions', value: profile.contributionsLastYear },
                      ]}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>
                <TabsContent value="repositories" className="mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {profile.topRepos.map((repo, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow"
                      >
                        <h3 className="text-lg font-semibold">{repo.name}</h3>
                        <div className="flex gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" /> {repo.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitBranch className="h-4 w-4" /> {repo.forks}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" /> {repo.watchers}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary/90"
                    >
                      <a
                        href={`https://github.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View GitHub Profile
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open {profile.name}&apos;s GitHub profile in a new tab</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function DevMetric({ icon: Icon, value, label }: { icon: any, value: number, label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center p-4 rounded-lg bg-primary/5 backdrop-blur-sm"
    >
      <Icon className="h-8 w-8 text-primary mb-2" />
      <span className="text-2xl font-bold text-primary">{value.toLocaleString()}</span>
      <span className="text-sm text-muted-foreground text-center">{label}</span>
    </motion.div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <Card className="w-full overflow-hidden backdrop-blur-xl bg-white/80 border-none shadow-lg">
        <CardHeader className="relative">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

