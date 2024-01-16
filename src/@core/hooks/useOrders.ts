import { QueryFilterConstraint, Unsubscribe, and, collection, doc, getDoc, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "src/configs/auth";
import firebase from "src/firebase/config";
import { Order } from "../utils/types";

export const useOrders = (...queryConstraints: QueryFilterConstraint[]): [Order[], loading: boolean, error: any] => {
  const { user, loading: isAuthLoading, error: authError } = useAuth();
  const [adminDepartment, setDepart] = useState<string>(null);
  const [orders, setOrders] = useState<Order[]>(null);
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
    const filter = and(where('formType', '==', adminDepartment), ...queryConstraints);
    const dbQuery = query(collection(getFirestore(firebase), 'orders',), filter);
    unsubscribe.current = onSnapshot(dbQuery, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id,
        } as Order;
      });
      setOrders(data);
    });
  }, []);

  useEffect(() => {
    try {
      if (user && !adminDepartment) {
        fetchAdminDepartment(user.uid);
      }

      if (adminDepartment && !orders) {
        fetchOrders(adminDepartment);
      }
      if (orders) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, [user, adminDepartment, orders]);

  return [orders, loading, error];
};
