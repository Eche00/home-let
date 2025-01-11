// regLogic to handle the registration process
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Default role and group
const defaultRole = 'customer';
const defaultGroup = 'activated';

export const handleRegistration = async (formData) => {
    const { email, password, username, fullName, address, gender, dob, state, number } = formData;

    // Ensure terms are agreed
    if (!formData.termsAgreed) {
        throw new Error('You must agree to the terms and conditions.');
    }

    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user details in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username,
            fullName,
            email,
            address,
            role: defaultRole,
            group: defaultGroup,
            gender,
            dob,
            state,
            number,
            termsAgreed: true,
        });

        console.log('User registered successfully:');
    } catch (error) {
        console.error('Registration failed:', error);
        throw new Error('Registration failed. Please try again.');
    }
};
