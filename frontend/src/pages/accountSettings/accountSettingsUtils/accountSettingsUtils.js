// Firebase Firestore service
import { fireStore } from "../../../firebase/firebaseServices.js";

// Converts a string to title case
function titleCase(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

// Update the preferences in the Firebase Firestore
const updatePreferences = async ({
  setLoading,
  setError,
  setSuccess,
  userData,
}) => {
  try {
    setLoading(true);
    setError(false);
    setSuccess(false);

    const updatedData = {
      city: titleCase(userData?.city),
      preferred_fashion_style: titleCase(userData?.preferred_fashion_style),
      accessibility:
        userData?.accessibility.accessibility === "Color Blind"
          ? userData?.colorBlindnessType.colorBlindnessType
          : userData?.accessibility.accessibility,
    };
    // Update new data in the Firestore
    await fireStore.addData({ uid: userData?.uid, data: updatedData });

    // Success message
    setSuccess("Preferences updated successfully");

    // Reload the page for showing the updated data
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    // Error message
    setError("Something went wrong, please try again later");
  } finally {
    setLoading(false);
  }
};

export { titleCase, updatePreferences };
