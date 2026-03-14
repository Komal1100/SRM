'use client'

import { raiseServiceRequest } from '@/app/action/requests/requests.service'
import { useTransition } from 'react'

export default function RaiseServiceRequestForm({
  serviceRequestTypes,
}: {
  serviceRequestTypes: {
    ServiceRequestTypeID: number
    ServiceRequestTypeName: string
  }[]
}) {
  const [pending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      await raiseServiceRequest(formData)
    })
  }

  return (
    <form action={onSubmit} className="space-y-4 max-w-3xl">
      {/* Request Type */}
      <div>
        <label className="block font-medium">Request Type</label>
        <select
          name="ServiceRequestTypeID"
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select</option>
          {serviceRequestTypes.map((t) => (
            <option key={t.ServiceRequestTypeID} value={t.ServiceRequestTypeID}>
              {t.ServiceRequestTypeName}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block font-medium">Title</label>
        <input
          name="ServiceRequestTitle"
          required
          maxLength={250}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="ServiceRequestDescription"
          required
          maxLength={2000}
          rows={5}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Attachment (1 for now – extend later) */}
      <div>
        <label className="block font-medium">Attachment</label>
        <input type="file" name="attachment" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {pending ? 'Submitting...' : 'Raise Request'}
      </button>
    </form>
  )
}
