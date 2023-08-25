import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Typography } from '@mui/material';
import { collection, addDoc, getDocs, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from '../../../firebase/config';
import TextField from "@mui/material/TextField";

const AdminCodes = () => {
  const [codes, setCodes] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [showMaxCodesMessage, setShowMaxCodesMessage] = useState(false);

  useEffect(() => {
    const fetchAdminCodes = async () => {
      try {
        const querySnapshot = await getDocs(collection(getFirestore(firebase), 'adminCodes'));
        const codesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCodes(codesData);
      } catch (error) {
        console.error('Error fetching admin codes:', error);
      }
    };

    fetchAdminCodes();
  }, []);

  const handleGenerateCode = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(getFirestore(firebase), 'adminCodes')
      );
      const codesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const unusedCodes = codesData.filter((code) => code.used === false);

      if (unusedCodes.length < 4) {
        const docRef = await addDoc(
          collection(getFirestore(firebase), 'adminCodes'),
          { used: false }
        );
        const newCode = docRef.id;
        setCodes((prevCodes) => [
          ...prevCodes,
          { id: docRef.id, code: newCode, used: false },
        ]);
        setShowMaxCodesMessage(false); // Reset the max codes message
      } else {
        setShowMaxCodesMessage(true);
      }
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };


  const handleDeleteCode = async (codeId) => {
    try {
      await deleteDoc(doc(getFirestore(firebase), 'adminCodes', codeId));
      setCodes((prevCodes) => prevCodes.filter((code) => code.id !== codeId));
      setSelectedCode('');
      setOpenDeleteDialog(false);

      if (showMaxCodesMessage) {
        setShowMaxCodesMessage(false);
      }
    } catch (error) {
      console.error('Error deleting code:', error);
    }
  };


  const handleConfirmDelete = (codeId) => {
    setSelectedCode(codeId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedCode('');
    setOpenDeleteDialog(false);
  };

  const handleCopyCode = (codeId) => {
    const codeToCopy = codes.find((code) => code.id === codeId);
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy.id)
        .then(() => {
          console.log('Code copied successfully');
        })
        .catch((error) => {
          console.error('Error copying code:', error);
        });
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Generate adminSignUp codes
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Send the code below to the admin. This code can only be used once to register another admin.
      </Typography>

      <List>
        {codes.map((code) => (
          <ListItem key={code.id}>
            <ListItemText primary={<TextField
              value={code.id}
              onClick={() => handleCopyCode(code.id)}
              readOnly
              style={{ cursor: 'pointer' }}
            />} />
            <Button onClick={() => handleConfirmDelete(code.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
      {showMaxCodesMessage ? (
        <p>Maximum number of codes reached. Unable to generate new code.</p>
      ) : (
        <Button onClick={handleGenerateCode}>Generate Code</Button>
      )}

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the code?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={() => handleDeleteCode(selectedCode)} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>

  );
};

export default AdminCodes;
