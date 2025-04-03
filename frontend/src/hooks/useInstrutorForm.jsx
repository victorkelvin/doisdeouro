import { useState } from "react";


const useInstrutorForm = () => {
    const [username, setUsername] = useState("");
    const [nome, setNome] = useState("");
    const [is_active, setIsActive] = useState(false);
    const [graduacao, setGraduacao] = useState("");
    const [email, setEmail] = useState("");
    const [contato, setContato] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const resetForm = () => {
        setUsername("");
        setNome("");
        setIsActive(false);
        setGraduacao("");
        setEmail("");
        setContato("");
        setEditingId(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFoto(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    return {
        username,
        nome,
        is_active,
        setIsActive,
        graduacao,
        email,
        contato,
        editingId,
        setUsername,
        setNome,
        setGraduacao,
        setEmail,
        setContato,
        resetForm,
        setEditingId,
        handleFileChange,
        setFotoPreview,
        fotoPreview,
        foto,
        setFoto,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm
        
    };
}

export default useInstrutorForm;