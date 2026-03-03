import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileSidebar from '../../components/ProfileSidebar';
import { transactions } from './data';

export default function TransactionHistory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
      <Navbar />
      <div className="flex max-w-6xl mx-auto pt-8 pb-16 px-4 lg:px-0">
        <ProfileSidebar />
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8 ml-8">
          <h2 className="text-2xl font-semibold text-[#157A4F] mb-6">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-50">
                  <th className="py-3 px-4">Ad Title</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-4">
                      <Link href={`/profile/transactions/${tx.id}`} className="block text-[#157A4F] font-semibold hover:underline">
                        {tx.adTitle}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{tx.template}</td>
                    <td className="py-2 px-4">{tx.placement}</td>
                    <td className="py-2 px-4 font-bold text-green-700">₹{tx.totalPaid.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          tx.status === 'Success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{tx.paidOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
