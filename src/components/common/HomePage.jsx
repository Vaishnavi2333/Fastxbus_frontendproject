export function HomePage() {
return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "40px 20px",
        backgroundColor: "#f0f4f8",
      }}
    >
      <h1 style={{ 
        fontSize: "3rem", 
        fontWeight: "700", 
        color: "#0d6efd", 
        marginBottom: "20px" 
      }}>
        Welcome to SwiftBus
      </h1>
      <p style={{ 
        fontSize: "1.25rem", 
        color: "#6c757d", 
        maxWidth: "600px", 
        lineHeight: "1.6" 
      }}>
        Book your bus tickets quickly and easily. Enjoy a seamless travel experience with our reliable and convenient service.
      </p>
      <div style={{ marginTop: "30px" }}>
        <a href="/login" className="btn btn-primary me-3" style={{ padding: "10px 25px", fontSize: "1rem" }}>
          Login
        </a>
        <a href="/register" className="btn btn-success" style={{ padding: "10px 25px", fontSize: "1rem" }}>
          Register
        </a>
      </div>
    </div>
  );
}