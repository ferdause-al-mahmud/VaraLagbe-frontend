import Toast from "react-native-toast-message";

// Toast notification using react-native-toast-message
export const showToast = (title, message, type = "success") => {
    Toast.show({
        type: type, // 'success' | 'error' | 'info'
        position: "top",
        text1: title,
        text2: message,
        duration: 4000,
    });
};

