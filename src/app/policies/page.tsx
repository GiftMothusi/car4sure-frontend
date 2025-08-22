'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Download, Edit, Trash2, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/main-layout';
import AuthGuard from '@/components/auth-guard';

import { usePolicy } from '@/hooks/usePolicy';
import { Policy } from '@/types/policy';

export default function PoliciesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { 
    policies, 
    pagination,
    loading, 
    deletePolicy, 
    generatePolicyPdf,
    error 
  } = usePolicy({
    search: searchTerm,
    status: statusFilter,
    page,
    per_page: 15
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); 
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value === 'all' ? '' : value);
    setPage(1); 
  };

  const handleDelete = async (policy: Policy) => {
    if (confirm(`Are you sure you want to delete policy ${policy.policyNo}?`)) {
      try {
        await deletePolicy(policy.id!);
      } catch (error) {
        console.error('Failed to delete policy:', error);
      }
    }
  };

  const handleDownloadPdf = async (policy: Policy) => {
    try {
      const downloadUrl = await generatePolicyPdf(policy.id!);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Cancelled: 'bg-red-100 text-red-800',
    Expired: 'bg-red-100 text-red-800',
  };

  return (
    <AuthGuard>
      <MainLayout>
        <div className="px-4 py-6 sm:px-0">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Insurance Policies
              </h1>
              <p className="mt-2 text-gray-600">
                Manage all your insurance policies in one place
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/policies/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Policy
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search policies by number or holder name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error.message || 'Failed to load policies'}
            </div>
          )}

          <div className="mt-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading policies...</p>
              </div>
            ) : policies.length > 0 ? (
              <>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {policies.map((policy) => (
                      <li key={policy.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-indigo-600">
                                  {policy.policyNo}
                                </p>
                                <p className="text-sm text-gray-900 font-medium">
                                  {policy.policyHolderName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {policy.policyType} • {policy.vehicles?.length || 0} vehicle(s)
                                </p>
                                <p className="text-xs text-gray-500">
                                  Created: {new Date(policy.createdAt!).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  statusColors[policy.policyStatus]
                                }`}>
                                  {policy.policyStatus}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                  Expires: {new Date(policy.policyExpirationDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/policies/${policy.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/policies/${policy.id}/edit`)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadPdf(policy)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(policy)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {pagination.last_page > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {pagination.from} to {pagination.to} of {pagination.total} results
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                        .filter(pageNum => 
                          pageNum === 1 || 
                          pageNum === pagination.last_page || 
                          Math.abs(pageNum - page) <= 2
                        )
                        .map(pageNum => (
                          <Button
                            key={pageNum}
                            variant={pageNum === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === pagination.last_page}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || statusFilter 
                      ? 'Try adjusting your search filters'
                      : 'Get started by creating your first insurance policy'
                    }
                  </p>
                  <Link href="/policies/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Policy
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}