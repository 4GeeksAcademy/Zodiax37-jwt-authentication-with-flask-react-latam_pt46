import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LogForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Ver  ifica credenciales
            const res = await fetch("https://organic-doodle-gv7xr57x95qhvpjq-3001.app.github.dev/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg || "Credenciales incorrectas");
                return;
            }

            // Solicita el token usando el ID recibido
            const tokenRes = await fetch("https://organic-doodle-gv7xr57x95qhvpjq-3001.app.github.dev/api/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: data.user_id }),
            });

            const tokenData = await tokenRes.json();

            if (!tokenRes.ok) {
                alert(tokenData.msg || "Error al generar token");
                return;
            }

            // Guarda token en sessionStorage
            sessionStorage.setItem("token", tokenData.token);

            // Redirige a zona privada
            navigate("/private");
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error inesperado");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Iniciar sesión</h3>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Login
                                </button>
                            </form>


                            <div className="mt-5 text-center">
                                ¿No te has registrado? <Link to="/sign">Registrate aquí</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogForm;
