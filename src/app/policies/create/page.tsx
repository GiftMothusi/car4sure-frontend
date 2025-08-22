'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, ArrowLeft, Car } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/main-layout';
import AuthGuard from '@/components/auth-guard';

import { usePolicy } from '@/hooks/usePolicy';
import { policySchema } from '@/lib/validations';
import { PolicyFormData } from '@/types/policy';

export default function CreatePolicyPage() {
  const router = useRouter();
  const { createPolicy } = usePolicy();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      policyStatus: 'Pending',
      policyType: 'Auto',
      policyEffectiveDate: new Date().toISOString().split('T')[0],
      policyExpirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      policyHolder: {
        firstName: '',
        lastName: '',
        address: {
          street: '',
          city: '',
          state: '',
          zip: '',
        },
      },
      drivers: [{
        firstName: '',
        lastName: '',
        age: 25,
        gender: 'Male',
        maritalStatus: 'Single',
        licenseNumber: '',
        licenseState: '',
        licenseStatus: 'Valid',
        licenseEffectiveDate: '',
        licenseExpirationDate: '',
        licenseClass: 'C',
      }],
      vehicles: [{
        year: new Date().getFullYear(),
        make: '',
        model: '',
        vin: '',
        usage: 'Pleasure',
        primaryUse: 'Personal',
        annualMileage: 12000,
        ownership: 'Owned',
        garagingAddress: {
          street: '',
          city: '',
          state: '',
          zip: '',
        },
        coverages: [{
          type: 'Liability',
          limit: 25000,
          deductible: 500,
        }],
      }],
    },
  });

  const { fields: driverFields, append: appendDriver, remove: removeDriver } = useFieldArray({
    control,
    name: 'drivers',
  });

  const { fields: vehicleFields, append: appendVehicle, remove: removeVehicle } = useFieldArray({
    control,
    name: 'vehicles',
  });

  const watchedVehicles = watch('vehicles');

  const onSubmit = async (data: PolicyFormData) => {
    try {
      setIsSubmitting(true);
      const policy = await createPolicy({ data, setErrors });
      toast.success('Policy created successfully!', {
        description: `Policy #${policy.policyNo} has been created.`,
      });
      router.push(`/policies/${policy.id}`);
    } catch (error) {
      console.error('Failed to create policy:', error);
      toast.error('Failed to create policy', {
        description: 'An error occurred while creating the policy. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPolicyHolderAddress = (vehicleIndex: number) => {
    const policyHolderAddress = watch('policyHolder.address');
    setValue(`vehicles.${vehicleIndex}.garagingAddress`, policyHolderAddress);
  };

  const addCoverage = (vehicleIndex: number) => {
    const currentCoverages = watch(`vehicles.${vehicleIndex}.coverages`);
    setValue(`vehicles.${vehicleIndex}.coverages`, [
      ...currentCoverages,
      { type: 'Liability', limit: 25000, deductible: 500 },
    ]);
  };

  const removeCoverage = (vehicleIndex: number, coverageIndex: number) => {
    const currentCoverages = watch(`vehicles.${vehicleIndex}.coverages`);
    if (currentCoverages.length > 1) {
      setValue(
        `vehicles.${vehicleIndex}.coverages`,
        currentCoverages.filter((_, i) => i !== coverageIndex)
      );
    }
  };

  const displayErrors = { ...formErrors };
  Object.entries(errors).forEach(([key, messages]) => {
    if (messages?.length > 0) {
      displayErrors[key as keyof PolicyFormData] = { 
        message: messages[0],
        type: 'manual'
      };
    }
  });

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
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Create New Policy
            </h1>
            <p className="mt-2 text-gray-600">
              Fill out the form below to create a new insurance policy
            </p>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {Object.values(errors).flat()[0]}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Policy Information</CardTitle>
                <CardDescription>Basic policy details and dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="policyStatus">Policy Status</Label>
                    <Select
                      value={watch('policyStatus')}
                      onValueChange={(value) => setValue('policyStatus', value as 'Pending' | 'Active' | 'Inactive')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {displayErrors.policyStatus && (
                      <p className="text-sm text-red-600 mt-1">{displayErrors.policyStatus.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="policyType">Policy Type</Label>
                    <Input {...register('policyType')} />
                    {displayErrors.policyType && (
                      <p className="text-sm text-red-600 mt-1">{displayErrors.policyType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="policyEffectiveDate">Effective Date</Label>
                    <Input type="date" {...register('policyEffectiveDate')} />
                    {displayErrors.policyEffectiveDate && (
                      <p className="text-sm text-red-600 mt-1">{displayErrors.policyEffectiveDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="policyExpirationDate">Expiration Date</Label>
                    <Input type="date" {...register('policyExpirationDate')} />
                    {displayErrors.policyExpirationDate && (
                      <p className="text-sm text-red-600 mt-1">{displayErrors.policyExpirationDate.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Holder Information</CardTitle>
                <CardDescription>Details about the primary policy holder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="policyHolder.firstName">First Name</Label>
                    <Input {...register('policyHolder.firstName')} />
                    {displayErrors.policyHolder?.firstName && (
                      <p className="text-sm text-red-600 mt-1">{displayErrors.policyHolder.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="policyHolder.lastName">Last Name</Label>
                    <Input {...register('policyHolder.lastName')} />
                    {displayErrors.policyHolder?.lastName && (
                      <p className="text-sm text-red-600 mt-1">{displayErrors.policyHolder.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Address</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="policyHolder.address.street">Street Address</Label>
                      <Input {...register('policyHolder.address.street')} />
                      {displayErrors.policyHolder?.address?.street && (
                        <p className="text-sm text-red-600 mt-1">{displayErrors.policyHolder.address.street.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="policyHolder.address.city">City</Label>
                        <Input {...register('policyHolder.address.city')} />
                        {displayErrors.policyHolder?.address?.city && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.policyHolder.address.city.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="policyHolder.address.state">State</Label>
                        <Input {...register('policyHolder.address.state')} />
                        {displayErrors.policyHolder?.address?.state && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.policyHolder.address.state.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="policyHolder.address.zip">ZIP Code</Label>
                        <Input {...register('policyHolder.address.zip')} />
                        {displayErrors.policyHolder?.address?.zip && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.policyHolder.address.zip.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Drivers</CardTitle>
                    <CardDescription>Add all drivers who will be covered under this policy</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendDriver({
                      firstName: '',
                      lastName: '',
                      age: 25,
                      gender: 'Male',
                      maritalStatus: 'Single',
                      licenseNumber: '',
                      licenseState: '',
                      licenseStatus: 'Valid',
                      licenseEffectiveDate: '',
                      licenseExpirationDate: '',
                      licenseClass: 'C',
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Driver
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {driverFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Driver {index + 1}</h4>
                      {driverFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDriver(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input {...register(`drivers.${index}.firstName`)} />
                        {displayErrors.drivers?.[index]?.firstName && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.drivers[index]?.firstName?.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Last Name</Label>
                        <Input {...register(`drivers.${index}.lastName`)} />
                        {displayErrors.drivers?.[index]?.lastName && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.drivers[index]?.lastName?.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Age</Label>
                        <Input type="number" {...register(`drivers.${index}.age`, { valueAsNumber: true })} />
                        {displayErrors.drivers?.[index]?.age && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.drivers[index]?.age?.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Gender</Label>
                        <Select
                          value={watch(`drivers.${index}.gender`)}
                          onValueChange={(value) => setValue(`drivers.${index}.gender`, value as 'Male' | 'Female')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Marital Status</Label>
                        <Select
                          value={watch(`drivers.${index}.maritalStatus`)}
                          onValueChange={(value) => setValue(`drivers.${index}.maritalStatus`, value as 'Single' | 'Married' | 'Divorced' | 'Widowed')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>License Number</Label>
                        <Input {...register(`drivers.${index}.licenseNumber`)} />
                        {displayErrors.drivers?.[index]?.licenseNumber && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.drivers[index]?.licenseNumber?.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>License State</Label>
                        <Input {...register(`drivers.${index}.licenseState`)} />
                        {displayErrors.drivers?.[index]?.licenseState && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.drivers[index]?.licenseState?.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>License Status</Label>
                        <Select
                          value={watch(`drivers.${index}.licenseStatus`)}
                          onValueChange={(value) => setValue(`drivers.${index}.licenseStatus`, value as 'Valid' | 'Expired' | 'Suspended' | 'Revoked')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Valid">Valid</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                            <SelectItem value="Revoked">Revoked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>License Effective Date</Label>
                        <Input type="date" {...register(`drivers.${index}.licenseEffectiveDate`)} />
                        {displayErrors.drivers?.[index]?.licenseEffectiveDate && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.drivers[index]?.licenseEffectiveDate?.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>License Expiration Date</Label>
                        <Input type="date" {...register(`drivers.${index}.licenseExpirationDate`)} />
                        {displayErrors.drivers?.[index]?.licenseExpirationDate && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.drivers[index]?.licenseExpirationDate?.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>License Class</Label>
                        <Input {...register(`drivers.${index}.licenseClass`)} />
                        {displayErrors.drivers?.[index]?.licenseClass && (
                          <p className="text-sm text-red-600 mt-1">{displayErrors.drivers[index]?.licenseClass?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vehicles</CardTitle>
                    <CardDescription>Add all vehicles to be covered under this policy</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendVehicle({
                      year: new Date().getFullYear(),
                      make: '',
                      model: '',
                      vin: '',
                      usage: 'Pleasure',
                      primaryUse: 'Personal',
                      annualMileage: 12000,
                      ownership: 'Owned',
                      garagingAddress: {
                        street: '',
                        city: '',
                        state: '',
                        zip: '',
                      },
                      coverages: [{
                        type: 'Liability',
                        limit: 25000,
                        deductible: 500,
                      }],
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {vehicleFields.map((field, vehicleIndex) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        Vehicle {vehicleIndex + 1}
                      </h4>
                      {vehicleFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVehicle(vehicleIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label>Year</Label>
                          <Input type="number" {...register(`vehicles.${vehicleIndex}.year`, { valueAsNumber: true })} />
                          {displayErrors.vehicles?.[vehicleIndex]?.year && (
                            <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.year?.message}</p>
                          )}
                        </div>

                        <div>
                          <Label>Make</Label>
                          <Input {...register(`vehicles.${vehicleIndex}.make`)} />
                          {displayErrors.vehicles?.[vehicleIndex]?.make && (
                            <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.make?.message}</p>
                          )}
                        </div>

                        <div>
                          <Label>Model</Label>
                          <Input {...register(`vehicles.${vehicleIndex}.model`)} />
                          {displayErrors.vehicles?.[vehicleIndex]?.model && (
                            <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.model?.message}</p>
                          )}
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                          <Label>VIN</Label>
                          <Input {...register(`vehicles.${vehicleIndex}.vin`)} placeholder="17-character VIN" />
                          {displayErrors.vehicles?.[vehicleIndex]?.vin && (
                            <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.vin?.message}</p>
                          )}
                        </div>

                        <div>
                          <Label>Usage</Label>
                          <Select
                            value={watch(`vehicles.${vehicleIndex}.usage`)}
                            onValueChange={(value) => setValue(`vehicles.${vehicleIndex}.usage`, value as 'Pleasure' | 'Commuting' | 'Business' | 'Farm')}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pleasure">Pleasure</SelectItem>
                              <SelectItem value="Commuting">Commuting</SelectItem>
                              <SelectItem value="Business">Business</SelectItem>
                              <SelectItem value="Farm">Farm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Primary Use</Label>
                          <Input {...register(`vehicles.${vehicleIndex}.primaryUse`)} />
                          {displayErrors.vehicles?.[vehicleIndex]?.primaryUse && (
                            <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.primaryUse?.message}</p>
                          )}
                        </div>

                        <div>
                          <Label>Annual Mileage</Label>
                          <Input type="number" {...register(`vehicles.${vehicleIndex}.annualMileage`, { valueAsNumber: true })} />
                          {displayErrors.vehicles?.[vehicleIndex]?.annualMileage && (
                            <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.annualMileage?.message}</p>
                          )}
                        </div>

                        <div>
                          <Label>Ownership</Label>
                          <Select
                            value={watch(`vehicles.${vehicleIndex}.ownership`)}
                            onValueChange={(value) => setValue(`vehicles.${vehicleIndex}.ownership`, value as 'Owned' | 'Leased' | 'Financed')}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Owned">Owned</SelectItem>
                              <SelectItem value="Leased">Leased</SelectItem>
                              <SelectItem value="Financed">Financed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">Garaging Address</h5>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => copyPolicyHolderAddress(vehicleIndex)}
                          >
                            Copy Policy Holder Address
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label>Street Address</Label>
                            <Input {...register(`vehicles.${vehicleIndex}.garagingAddress.street`)} />
                            {displayErrors.vehicles?.[vehicleIndex]?.garagingAddress?.street && (
                              <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.garagingAddress?.street?.message}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>City</Label>
                              <Input {...register(`vehicles.${vehicleIndex}.garagingAddress.city`)} />
                              {displayErrors.vehicles?.[vehicleIndex]?.garagingAddress?.city && (
                                <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.garagingAddress?.city?.message}</p>
                              )}
                            </div>

                            <div>
                              <Label>State</Label>
                              <Input {...register(`vehicles.${vehicleIndex}.garagingAddress.state`)} />
                              {displayErrors.vehicles?.[vehicleIndex]?.garagingAddress?.state && (
                                <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.garagingAddress?.state?.message}</p>
                              )}
                            </div>

                            <div>
                              <Label>ZIP Code</Label>
                              <Input {...register(`vehicles.${vehicleIndex}.garagingAddress.zip`)} />
                              {displayErrors.vehicles?.[vehicleIndex]?.garagingAddress?.zip && (
                                <p className="text-sm text-red-600 mt-1">{displayErrors.vehicles[vehicleIndex]?.garagingAddress?.zip?.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">Coverage Options</h5>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addCoverage(vehicleIndex)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Coverage
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {watchedVehicles[vehicleIndex]?.coverages?.map((coverage, coverageIndex) => (
                            <div key={coverageIndex} className="flex items-end gap-4 p-3 bg-gray-50 rounded">
                              <div className="flex-1">
                                <Label>Coverage Type</Label>
                                <Select
                                  value={watch(`vehicles.${vehicleIndex}.coverages.${coverageIndex}.type`)}
                                  onValueChange={(value) => setValue(`vehicles.${vehicleIndex}.coverages.${coverageIndex}.type`, value as 'Liability' | 'Collision' | 'Comprehensive')}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Liability">Liability</SelectItem>
                                    <SelectItem value="Collision">Collision</SelectItem>
                                    <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex-1">
                                <Label>Limit (R)</Label>
                                <Input
                                  type="number"
                                  {...register(`vehicles.${vehicleIndex}.coverages.${coverageIndex}.limit`, { valueAsNumber: true })}
                                />
                              </div>

                              <div className="flex-1">
                                <Label>Deductible (R)</Label>
                                <Input
                                  type="number"
                                  {...register(`vehicles.${vehicleIndex}.coverages.${coverageIndex}.deductible`, { valueAsNumber: true })}
                                />
                              </div>

                              {watchedVehicles[vehicleIndex]?.coverages?.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeCoverage(vehicleIndex, coverageIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Policy...' : 'Create Policy'}
              </Button>
            </div>
          </form>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}