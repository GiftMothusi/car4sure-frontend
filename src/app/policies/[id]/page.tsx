'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Download, Trash2, Car, User, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/main-layout';
import AuthGuard from '@/components/auth-guard';

import { usePolicyStore } from '@/store/policyStore';
import { Policy } from '@/types/policy';

interface PolicyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PolicyDetailPage({ params }: PolicyDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { 
    currentPolicy, 
    isLoading, 
    error, 
    fetchPolicy, 
    deletePolicy, 
    generatePolicyPdf,
    clearCurrentPolicy 
  } = usePolicyStore();

  useEffect(() => {
    if (id) {
      fetchPolicy(parseInt(id));
    }

    return () => {
      clearCurrentPolicy();
    };
  }, [id, fetchPolicy, clearCurrentPolicy]);

  const handleDelete = async () => {
    if (!currentPolicy) return;

    if (confirm(`Are you sure you want to delete policy ${currentPolicy.policyNo}?`)) {
      try {
        await deletePolicy(currentPolicy.id!);
        router.push('/policies');
      } catch (error) {
        console.error('Failed to delete policy:', error);
      }
    }
  };

  const handleDownloadPdf = async () => {
    if (!currentPolicy) return;

    try {
      const downloadUrl = await generatePolicyPdf(currentPolicy.id!);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Active: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Inactive: 'bg-gray-100 text-gray-800',
      Cancelled: 'bg-red-100 text-red-800',
      Expired: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading policy details...</p>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  if (error || !currentPolicy) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Policy Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'The requested policy could not be found.'}</p>
              <Link href="/policies">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Policies
                </Button>
              </Link>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <MainLayout>
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                  Policy {currentPolicy.policyNo}
                </h1>
                <p className="mt-2 text-gray-600">
                  Policy details and coverage information
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadPdf}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Link href={`/policies/${currentPolicy.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Policy Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Policy Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Policy Number</label>
                    <p className="text-lg font-semibold">{currentPolicy.policyNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentPolicy.policyStatus)}`}>
                        {currentPolicy.policyStatus}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Policy Type</label>
                    <p className="text-lg">{currentPolicy.policyType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Effective Date</label>
                    <p className="text-lg">{new Date(currentPolicy.policyEffectiveDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expiration Date</label>
                    <p className="text-lg">{new Date(currentPolicy.policyExpirationDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-lg">{new Date(currentPolicy.createdAt!).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policy Holder Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Policy Holder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg">{currentPolicy.policyHolder.firstName} {currentPolicy.policyHolder.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-lg">
                      {currentPolicy.policyHolder.address.street}<br />
                      {currentPolicy.policyHolder.address.city}, {currentPolicy.policyHolder.address.state} {currentPolicy.policyHolder.address.zip}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Drivers Information */}
            <Card>
              <CardHeader>
                <CardTitle>Drivers ({currentPolicy.drivers.length})</CardTitle>
                <CardDescription>All drivers covered under this policy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPolicy.drivers.map((driver, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Driver {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Name</label>
                          <p>{driver.firstName} {driver.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Age</label>
                          <p>{driver.age}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Gender</label>
                          <p>{driver.gender}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Marital Status</label>
                          <p>{driver.maritalStatus}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">License Number</label>
                          <p>{driver.licenseNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">License State</label>
                          <p>{driver.licenseState}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">License Status</label>
                          <p>{driver.licenseStatus}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">License Class</label>
                          <p>{driver.licenseClass}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">License Expires</label>
                          <p>{new Date(driver.licenseExpirationDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vehicles Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Vehicles ({currentPolicy.vehicles.length})
                </CardTitle>
                <CardDescription>All vehicles covered under this policy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentPolicy.vehicles.map((vehicle, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-4">Vehicle {index + 1}: {vehicle.year} {vehicle.make} {vehicle.model}</h4>
                      
                      <div className="space-y-4">
                        {/* Vehicle Details */}
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Vehicle Details</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Year</label>
                              <p>{vehicle.year}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Make</label>
                              <p>{vehicle.make}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Model</label>
                              <p>{vehicle.model}</p>
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                              <label className="text-sm font-medium text-gray-500">VIN</label>
                              <p className="font-mono">{vehicle.vin}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Usage</label>
                              <p>{vehicle.usage}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Primary Use</label>
                              <p>{vehicle.primaryUse}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Annual Mileage</label>
                              <p>{vehicle.annualMileage.toLocaleString()} miles</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Ownership</label>
                              <p>{vehicle.ownership}</p>
                            </div>
                          </div>
                        </div>

                        {/* Garaging Address */}
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Garaging Address</h5>
                          <p>
                            {vehicle.garagingAddress.street}<br />
                            {vehicle.garagingAddress.city}, {vehicle.garagingAddress.state} {vehicle.garagingAddress.zip}
                          </p>
                        </div>

                        {/* Coverage */}
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Coverage</h5>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Coverage Type
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Limit
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deductible
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {vehicle.coverages.map((coverage, coverageIndex) => (
                                  <tr key={coverageIndex}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {coverage.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      R{coverage.limit.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      R{coverage.deductible.toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}