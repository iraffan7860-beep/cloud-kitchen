const loginTest = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD
        })
      }
    );

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Success:", data.success);
    console.log("Message:", data.message);

    if (data.success) {
      console.log("Admin:", data.admin);
      console.log("Login test successful!");
    }

  } catch (error) {
    console.log("Error:", error.message);
  }
};

loginTest();