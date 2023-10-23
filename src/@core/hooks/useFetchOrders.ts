import { getAuth } from "firebase/auth";
import { doc, getFirestore, getDoc, getDocs, query, collection, where, and, onSnapshot, Unsubscribe, Query, QueryFilterConstraint } from "firebase/firestore";
import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "src/configs/auth";
import firebase from "src/firebase/config";


export const useFetchOrders = (...queryConstraints: QueryFilterConstraint[]) => {
  const { user, loading: isAuthLoading, error: authError } = useAuth();
  const [adminDepartment, setDepart] = useState<string>(null);
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribe = useRef<Unsubscribe>();

  const fetchAdminDepartment = useCallback(async (adminId: string) => {
    const adminDocRef = doc(getFirestore(firebase), 'admins', adminId);
    const adminDoc = await getDoc(adminDocRef);
    if (adminDoc.exists()) {
      setDepart(adminDoc.get('department'));
    }
  }, []);

  const fetchOrders = useCallback(async (adminDepartment: string) => {
    console.log('fetching orders for ' + adminDepartment);
    console.log(`constraints: ${queryConstraints}`);
    const filter = and(where('formType', '==', adminDepartment), ...queryConstraints);
    const dbQuery = query(collection(getFirestore(firebase), 'orders',), filter)
    unsubscribe.current = onSnapshot(dbQuery, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => doc.data());
      setOrders(data);
    })
  }, []);

  useEffect(() => {
    try {
      if (user && !adminDepartment) {
        console.log(`uid: ${user.uid}`)
        fetchAdminDepartment(user.uid)
      }

      if (adminDepartment && !orders) {
        console.log(`dpt: ${adminDepartment}`)
        fetchOrders(adminDepartment);
      }
      if (orders) {
        console.log(`There are ${orders} accepted orders`)
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(error)
    }

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
      console.info('%cUnsubscribing to snapshot changes...', 'color: blue; font-family: monospace; font-weight: bold;')
    }
  }, [user, adminDepartment, orders])

  return [orders, loading, error]
}