import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleSignUp = async (e) => {
        e.preventDefault();

        const res = await fetch("https://organic-doodle-gv7xr57x95qhvpjq-3001.app.github.dev/api/sign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.msg);
            return;
        }

        alert("Usuario creado exitosamente.");
        navigate("/login");
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Crear cuenta</h3>
                            <form onSubmit={handleSignUp}>
                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Sign
                                </button>
                            </form>

                            <div className="mt-5 text-center">
                                ¿Ya te te registraste? <Link to="/login">Inicia sesión aquí</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignForm;
