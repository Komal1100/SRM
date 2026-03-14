import RaiseServiceRequestForm from '@/app/dashboard/components/requests/RaiseServiceRequestForm'
import { prisma } from '@/app/lib/prisma'

export default async function NewServiceRequestPage() {
  const serviceRequestTypes = await prisma.servicerequesttype.findMany({
    select: {
      ServiceRequestTypeID: true,
      ServiceRequestTypeName: true,
    },
  })

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">
        Raise Service Request
      </h1>

      <RaiseServiceRequestForm
        serviceRequestTypes={serviceRequestTypes}
      />
    </>
  )
}
