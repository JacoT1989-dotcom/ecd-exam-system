"use client";

interface ContactInfoProps {
  email?: string;
  streetAddress?: string;
  suburb?: string | null;
  townCity?: string;
  postcode?: string;
  country?: string;
}

export function ContactInfo({
  email,
  streetAddress,
  suburb,
  townCity,
  postcode,
  country,
}: ContactInfoProps) {
  // Helper function to format address
  const formatAddress = () => {
    const parts = [streetAddress, suburb, townCity, postcode, country].filter(
      Boolean,
    );

    return parts.join(", ");
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg flex-1">
      <h3 className="text-sm font-semibold mb-2 text-gray-800">
        Contact Information
      </h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="mr-2 text-lg">📧</span>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-xs text-gray-800">{email}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-lg">📍</span>
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <p className="text-xs text-gray-800">{formatAddress()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
