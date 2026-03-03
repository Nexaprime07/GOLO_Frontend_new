import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProfileSidebar from '../../../components/ProfileSidebar';
import { getTransactionById } from '../data';

export default async function TransactionDetailPage({ params }) {
  const resolvedParams = await params;
  const transactionId = resolvedParams?.id;
  const transaction = getTransactionById(transactionId);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
        <Navbar />
        <div className="max-w-3xl mx-auto py-16 px-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Transaction not found</h2>
            <p className="text-gray-600 mb-6">This transaction id is invalid or no longer available.</p>
            <Link href="/profile/transactions" className="inline-flex items-center px-4 py-2 rounded-lg bg-[#157A4F] text-white font-semibold hover:bg-[#0f5c3a] transition">
              Back to Transactions
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
      <Navbar />
      <div className="flex max-w-6xl mx-auto pt-8 pb-16 px-4 lg:px-0">
        <ProfileSidebar />
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8 ml-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#157A4F]">Transaction Details</h2>
            <Link href="/profile/transactions" className="text-sm font-semibold text-[#157A4F] hover:underline">
              ← Back to History
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="font-semibold text-gray-900">{transaction.id}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">Reference</p>
              <p className="font-semibold text-gray-900">{transaction.transactionRef}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="font-semibold text-gray-900">{transaction.paymentMethod} • {transaction.paymentProvider}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">Paid On</p>
              <p className="font-semibold text-gray-900">{transaction.paidOn}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">Payment Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
                  transaction.status === 'Success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {transaction.status}
              </span>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden mb-8">
            <div className="bg-green-50 px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Ad Billing Summary</h3>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Ad Title</span><span className="font-medium text-gray-900">{transaction.adTitle}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Template</span><span className="font-medium text-gray-900">{transaction.template}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Placement</span><span className="font-medium text-gray-900">{transaction.placement}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Duration</span><span className="font-medium text-gray-900">{transaction.durationDays} days</span></div>
              <div className="border-t border-dashed border-gray-200 pt-3"></div>
              <div className="flex justify-between"><span className="text-gray-600">Base Amount</span><span className="font-medium text-gray-900">₹{transaction.baseAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Platform Fee</span><span className="font-medium text-gray-900">₹{transaction.platformFee.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium text-gray-900">₹{transaction.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">GST</span><span className="font-medium text-gray-900">₹{transaction.gst.toFixed(2)}</span></div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
                <span className="font-semibold text-gray-900">Total Paid</span>
                <span className="font-bold text-[#157A4F]">₹{transaction.totalPaid.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-900 mb-1">Additional Notes</p>
            <p className="text-gray-700">{transaction.notes}</p>
            <p className="text-gray-600 mt-2">Billed To: {transaction.billedTo} • Ad ID: {transaction.adId} • Status: {transaction.status}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
