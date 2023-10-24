import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, apiAuthorizationToken, userToken } from './apiConfig';
import { useNavigate } from 'react-router-dom';
import "../styles/FormularioCadastro.css";

function FormularioCadastro(props) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        tags: '',
        published_at: getCurrentISODate(),
        featured_until: getCurrentISODate(),
        youtube_link: '',
        primary_text: '',
        secondary_text: '',
        seo_title: '',
        seo_tags: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para rastrear o envio do formulário

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            alert('O campo título é obrigatório. Preencha antes de enviar.');
            return;
        }

        // Ativa o estado isSubmitting antes do envio
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_URL}/posts`, formData, {
                headers: {
                    'Api-Authorization': apiAuthorizationToken,
                    'Authorization': userToken,
                },
            });

            setIsSubmitting(false); // Desativa o estado isSubmitting após o envio

            setFormData({
                title: '',
                tags: '',
                published_at: '',
                featured_until: '',
                youtube_link: '',
                primary_text: '',
                secondary_text: '',
                seo_title: '',
                seo_tags: '',
            });
            navigate('/');
        } catch (error) {
            console.error('Erro ao cadastrar a postagem:', error);
            setIsSubmitting(false); // Certifique-se de desativar o estado isSubmitting em caso de erro
        }
    };

    function getCurrentISODate() {
        const now = new Date();
        const isoString = now.toISOString();
        return isoString;
    }

    return (
        <div className='listMain2'>
            <div>
                <h1>Cadastro de Postagens</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Tags</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Link do YouTube</label>
                    <input
                        type="text"
                        name="youtube_link"
                        value={formData.youtube_link}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Texto Principal</label>
                    <textarea
                        name="primary_text"
                        value={formData.primary_text}
                        onChange={handleInputChange}
                        cols="42" rows="5"
                    />
                </div>
                <div>
                    <label>Texto Secundário</label>
                    <textarea
                        name="secondary_text"
                        value={formData.secondary_text}
                        onChange={handleInputChange}
                        cols="42" rows="5"
                    />
                </div>
                <div>
                    <label>Título SEO</label>
                    <input
                        type="text"
                        name="seo_title"
                        value={formData.seo_title}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Tags SEO</label>
                    <input
                        type="text"
                        name="seo_tags"
                        value={formData.seo_tags}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    {/* Mostrar "Enviando..." durante o envio */}
                    {isSubmitting ? (
                        <button type="submit" disabled>Enviando...</button>
                    ) : (
                        <button type="submit">Enviar</button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default FormularioCadastro;
