import axios from "axios";

function ApiButton({
  url,
  method = "POST",
  body = {},
  label,
  onSuccess,
  onError,
}) {
  const handleClick = async () => {
    try {
      const res = await axios({
        url,
        method,
        data: body,
        withCredentials: true,
      });

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      const errorData = err.response?.data || { message: err.message };
      console.error("API Error:", errorData);

      if (onError) onError(errorData);
    }
  };

  return <button onClick={handleClick}>{label}</button>;
}

export default ApiButton;
