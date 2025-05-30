import React, { useEffect, useState } from "react";

const PrivCmp = () => {
    const [user, setUser] = useState(null);
    const [msg, setMsg] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrivateData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                console.log(token);
                
                const response = await fetch("https://organic-doodle-gv7xr57x95qhvpjq-3001.app.github.dev/api/private", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setMsg(data.msg);
                    setUser(data.user);
                    setPass(data.pass)
                } else {
                    setMsg("Acceso denegado o token inválido.");
                }
            } catch (error) {
                setMsg("Error al conectar con el backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrivateData();
    }, []);

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h2>Zona Privada 🔒</h2>
                <p>{msg}</p>
                {user && (
                    <div>
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Pass:</strong> {pass}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrivCmp;
