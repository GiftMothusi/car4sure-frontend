"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Plus, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Shield, Car, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MainLayout from "@/components/layout/main-layout"
import AuthGuard from "@/components/auth-guard"

import { usePolicyStore } from "@/store/policyStore"
import { useAuthStore } from "@/store/authStore"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { policies, fetchPolicies, isLoading } = usePolicyStore()

  useEffect(() => {
    fetchPolicies()
  }, [fetchPolicies])

  const stats = {
    total: policies.length,
    active: policies.filter((p) => p.policyStatus === "Active").length,
    pending: policies.filter((p) => p.policyStatus === "Pending").length,
    expiring: policies.filter((p) => {
      const expirationDate = new Date(p.policyExpirationDate)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return expirationDate <= thirtyDaysFromNow && p.policyStatus === "Active"
    }).length,
  }

  const recentPolicies = policies.slice(0, 5)

  return (
    <AuthGuard>
      <MainLayout>
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-8 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-50"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold text-foreground mb-2 font-heading">Welcome back, {user?.name}!</h1>
              <p className="text-lg text-muted-foreground font-body">
                Manage your insurance policies with confidence and ease
              </p>
            </div>
            <div className="absolute top-4 right-4 opacity-20">
              <Shield className="h-24 w-24 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground font-body">Total Policies</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground font-heading">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1 font-body">All your insurance policies</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground font-body">Active Policies</CardTitle>
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-chart-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chart-2 font-heading">{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-1 font-body">Currently active policies</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground font-body">Pending Policies</CardTitle>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 font-heading">{stats.pending}</div>
                <p className="text-xs text-muted-foreground mt-1 font-body">Awaiting activation</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground font-body">Expiring Soon</CardTitle>
                <div className="p-2 bg-chart-4/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-chart-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chart-4 font-heading">{stats.expiring}</div>
                <p className="text-xs text-muted-foreground mt-1 font-body">Expiring within 30 days</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 font-heading">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/policies/create">
                <Card className="dashboard-card cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground font-heading">Create New Policy</h3>
                        <p className="text-sm text-muted-foreground font-body">Start a new insurance policy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/policies">
                <Card className="dashboard-card cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                        <FileText className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground font-heading">View All Policies</h3>
                        <p className="text-sm text-muted-foreground font-body">Manage existing policies</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/claims">
                <Card className="dashboard-card cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-chart-5/10 rounded-xl group-hover:bg-chart-5/20 transition-colors">
                        <TrendingUp className="h-6 w-6 text-chart-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground font-heading">File a Claim</h3>
                        <p className="text-sm text-muted-foreground font-body">Submit insurance claims</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground font-heading">Recent Policies</h2>
              <Link
                href="/policies"
                className="text-sm text-primary hover:text-primary/80 font-medium font-body transition-colors"
              >
                View all →
              </Link>
            </div>

            {isLoading ? (
              <Card className="dashboard-card">
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground font-body">Loading policies...</p>
                </CardContent>
              </Card>
            ) : recentPolicies.length > 0 ? (
              <div className="space-y-4">
                {recentPolicies.map((policy) => (
                  <Link key={policy.id} href={`/policies/${policy.id}`}>
                    <Card className="policy-item cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                              <Car className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-primary font-heading">{policy.policyNo}</p>
                              <p className="text-foreground font-medium font-body">{policy.policyHolderName}</p>
                              <p className="text-sm text-muted-foreground font-body">
                                {policy.policyType} • {policy.vehicles?.length || 0} vehicle(s)
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-body ${
                                policy.policyStatus === "Active"
                                  ? "bg-chart-2/10 text-chart-2"
                                  : policy.policyStatus === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {policy.policyStatus}
                            </span>
                            <div className="flex items-center text-xs text-muted-foreground font-body">
                              <Calendar className="h-3 w-3 mr-1" />
                              Expires: {new Date(policy.policyExpirationDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="dashboard-card">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-muted/50 rounded-2xl w-fit mx-auto mb-6">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 font-heading">No policies yet</h3>
                  <p className="text-muted-foreground mb-6 font-body">
                    Get started by creating your first insurance policy
                  </p>
                  <Link href="/policies/create">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Policy
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  )
}
