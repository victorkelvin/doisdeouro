import { useState } from "react";


const useInstrutorForm = () => {
    const [username, setUsername] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [is_active, setIsActive] = useState(false);
    const [graduacao, setGraduacao] = useState("");
    const [email, setEmail] = useState("");
    const [contato, setContato] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState("");

    const resetForm = () => {
        setUsername("");
        setFirstName("");
        setLastName("");
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
        first_name,
        last_name,
        is_active,
        setIsActive,
        graduacao,
        email,
        contato,
        editingId,
        setUsername,
        setFirstName,
        setLastName,
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
    };
}

export default useInstrutorForm;