import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListaDePostagens from './pages/ListaDePostagens';
import FormularioCadastro from './pages/FormularioCadastro';
import DetalhesDaPostagem from './pages/DetalhesDaPostagem';
import ExcluirPostagem from './pages/ExcluirPostagem';
import EdicaoDePostagem from './pages/EdicaoDePostagem';

function App() {
  const redirectToPostagens = () => {
    // Redireciona o usuário para a página de postagens
    // Você pode definir a lógica de redirecionamento aqui
    // Por exemplo, você pode usar window.location.href ou outra abordagem de roteamento
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListaDePostagens redirectToPostagens={redirectToPostagens} />} />
        <Route path="/cadastro" element={<FormularioCadastro redirectToPostagens={redirectToPostagens} />} />
        <Route path="/detalhes/:id" element={<DetalhesDaPostagem />} />
        <Route path="/excluir/:id" element={<ExcluirPostagem />} />
        <Route path="/editar/:id" element={<EdicaoDePostagem />} />
      </Routes>
    </Router>
  );
}

export default App;
