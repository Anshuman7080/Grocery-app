'use client';
import React, { useContext, useEffect, useState } from 'react';
import { UpdateCartContext } from '@/app/_context/UpdateCartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowBigRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { buyCartItem } from '@/app/_components/Payment';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);

  const [totalCartItem, setTotalCartItem] = useState(0);
  const [cartItemList, setCartItemList] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');

  const [updateStatus, setUpdateStatus] = useState('');
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    } else {
      setUserName(session.user?.name || '');
      setEmail(session.user?.email || '');
    }
  }, [session, status]);

  useEffect(() => {
    const getCartItem = async () => {
      try {
        const res = await fetch("/api/getCartItem");
        const data = await res.json();
        setCartItemList(data?.response || []);
        setTotalCartItem(data?.response?.length || 0);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    getCartItem();
  }, [updateCart]);

  useEffect(() => {
    let total = 0;
    cartItemList.forEach((item) => {
      total += item.price;
    });
    setSubTotal(total.toFixed(2));
  }, [cartItemList]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch('/api/getUserAddress');
        const data = await res.json();
        const addr = data?.response;
        if (addr) {
          setUserName(addr.name || '');
          setEmail(addr.email || '');
          setPhone(addr.phone || '');
          setZip(addr.zip || '');
          setAddress(addr.addressBlock || '');
        }
      } catch (err) {
        console.error('Error fetching address:', err);
      }
    };

    if (session?.user?.email) {
      fetchAddress();
    }
  }, [session, status]);

  const handleAddressUpdate = async () => {
    setIsUpdatingAddress(true);
    setUpdateStatus('');
    try {
      const res = await fetch('/api/updateAddress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          email,
          phone,
          zip,
          addressBlock: address,
        }),
      });

      if (!res.ok) throw new Error('Failed to update address');
      setUpdateStatus('✅ Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
      setUpdateStatus('❌ Failed to update address.');
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handleMakePayment = async () => {
    setIsPaying(true);
    setPaymentStatus('');
    try {
      await buyCartItem({ router, session, setUpdateCart, updateCart });
      setPaymentStatus('✅ Payment successful!');
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentStatus('❌ Payment failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  const taxAmount = (Number(subTotal) * 0.09).toFixed(2);
  const totalAmount = (Number(subTotal) + Number(taxAmount) + 15).toFixed(2);

  if (status === 'loading') {
    return <div className="text-center py-10 text-lg font-medium">Loading...</div>;
  }

  return (
    <div>
      <h2 className="p-3 bg-green-700 text-xl font-bold text-center text-white">Checkout</h2>
      <div className="p-5 px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 py-8">
        {/* Billing Section */}
        <div className="md:col-span-2 mx-20">
          <h2 className="font-bold text-3xl">Billing Details</h2>
          <div className="grid grid-cols-2 gap-10 mt-3">
            <Input placeholder="Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-10 mt-3">
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input placeholder="Zip" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
          <div className="mt-3">
            <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <Button
            className="mt-4 mb-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            onClick={handleAddressUpdate}
            disabled={isUpdatingAddress}
          >
            {isUpdatingAddress ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Updating...
              </>
            ) : (
              "Update Address"
            )}
          </Button>

          {updateStatus && (
            <p className={`mt-2 font-medium ${updateStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {updateStatus}
            </p>
          )}
        </div>

        {/* Summary Section */}
        <div className="mx-10 border rounded-xl shadow-md">
          <h2 className="p-3 bg-gray-200 font-bold text-center">
            Total Cart ({totalCartItem.toString().padStart(2, '0')})
          </h2>
          <div className="p-4 flex flex-col gap-4">
            <h2 className="font-bold flex justify-between">Subtotal: <span>${subTotal}</span></h2>
            <hr />
            <h2 className="flex justify-between">Delivery: <span>$15.00</span></h2>
            <h2 className="flex justify-between">Tax (9%): <span>${taxAmount}</span></h2>
            <hr />
            <h2 className="font-bold flex justify-between text-lg">Total: <span>${totalAmount}</span></h2>

            <Button
              disabled={(!userName || !email || !address || !zip || !phone || totalAmount == 15 || isPaying)}
              onClick={handleMakePayment}
              className="bg-green-700 text-white hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-600 flex items-center justify-center gap-2"
            >
              {isPaying ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Processing Payment...
                </>
              ) : (
                <>
                  Payment <ArrowBigRight />
                </>
              )}
            </Button>

            {paymentStatus && (
              <div className={`flex items-center gap-2 text-sm font-medium ${paymentStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                <CheckCircle2 className="h-4 w-4" /> {paymentStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
