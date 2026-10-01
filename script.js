document.addEventListener('DOMContentLoaded', () => {
  const cardLogin = document.getElementById('cardLogin');
  const cardCadastro = document.getElementById('cardCadastro');
  const cardAgenda = document.getElementById('cardAgenda');

  const btnIrCadastro = document.getElementById('btnIrCadastro');
  const btnIrLogin = document.getElementById('btnIrLogin');
  const btnSair = document.getElementById('btnSair');

  const formLogin = document.getElementById('formLogin');
  const formCadastro = document.getElementById('formCadastro');
  const formAgenda = document.getElementById('formAgenda');

  const inputData = document.getElementById('agendaData');
  const inputHora = document.getElementById('agendaHora');
  const listaHorarios = document.getElementById('listaHorarios');
  const botoesHora = document.querySelectorAll('.btn-hora');

  // Bloqueia datas passadas
  if (inputData) {
    const hoje = new Date().toISOString().split('T')[0];
    inputData.setAttribute('min', hoje);
  }

  // Controle de Seleção dos Botões de Horário Rosa
  botoesHora.forEach((btn) => {
    btn.addEventListener('click', () => {
      botoesHora.forEach((b) => b.classList.remove('selecionado'));
      btn.classList.add('selecionado');
      inputHora.value = btn.getAttribute('data-hora');
    });
  });

  // Alternar para Cadastro
  btnIrCadastro.addEventListener('click', () => {
    cardLogin.classList.add('hidden');
    cardCadastro.classList.remove('hidden');
  });

  // Alternar para Login
  btnIrLogin.addEventListener('click', () => {
    cardCadastro.classList.add('hidden');
    cardLogin.classList.remove('hidden');
  });

  // Sair/Logout
  btnSair.addEventListener('click', () => {
    cardAgenda.classList.add('hidden');
    cardLogin.classList.remove('hidden');
    formLogin.reset();
  });

  // Cadastro
  formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('cadNome').value.trim();
    const email = document.getElementById('cadEmail').value.trim();
    const senha = document.getElementById('cadSenha').value;
    const confirmarSenha = document.getElementById('cadConfirmarSenha').value;

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    const usuario = { nome, email, senha };
    localStorage.setItem('usuarioRegistrado', JSON.stringify(usuario));

    alert(`Cadastro realizado com sucesso, ${nome}! Faça seu login.`);
    formCadastro.reset();
    cardCadastro.classList.add('hidden');
    cardLogin.classList.remove('hidden');
  });

  // Login
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailDigitado = document.getElementById('loginEmail').value.trim();
    const senhaDigitada = document.getElementById('loginSenha').value;

    const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioRegistrado'));

    if (usuarioSalvo && usuarioSalvo.email === emailDigitado && usuarioSalvo.senha === senhaDigitada) {
      alert(`Bem-vinda(o), ${usuarioSalvo.nome}!`);
      cardLogin.classList.add('hidden');
      cardAgenda.classList.remove('hidden');
      atualizarListaAgendamentos();
    } else {
      alert('E-mail ou senha incorretos.');
    }
  });

  // Confirmar Agendamento (Segunda a Sexta)
  formAgenda.addEventListener('submit', (e) => {
    e.preventDefault();

    const servico = document.getElementById('agendaServico').value;
    const dataSelecionada = inputData.value;
    const horaSelecionada = inputHora.value;

    if (!horaSelecionada) {
      alert('Por favor, selecione um dos horários cor-de-rosa.');
      return;
    }

    const partesData = dataSelecionada.split('-');
    const dataObj = new Date(partesData[0], partesData[1] - 1, partesData[2]);
    const diaDaSemana = dataObj.getDay();

    if (diaDaSemana === 0 || diaDaSemana === 6) {
      alert('Atendimento apenas de Segunda a Sexta-feira!');
      return;
    }

    const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
    const agendamentos = JSON.parse(localStorage.getItem('meusAgendamentos')) || [];

    agendamentos.push({ servico, data: dataFormatada, hora: horaSelecionada });
    localStorage.setItem('meusAgendamentos', JSON.stringify(agendamentos));

    alert(`Agendamento confirmado para ${dataFormatada} às ${horaSelecionada}!`);

    inputHora.value = '';
    botoesHora.forEach((b) => b.classList.remove('selecionado'));
    formAgenda.reset();
    atualizarListaAgendamentos();
  });

  function atualizarListaAgendamentos() {
    const agendamentos = JSON.parse(localStorage.getItem('meusAgendamentos')) || [];
    listaHorarios.innerHTML = '';

    if (agendamentos.length === 0) {
      listaHorarios.innerHTML = '<li style="color:#888; font-style:italic;">Nenhum agendamento realizado.</li>';
      return;
    }

    agendamentos.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.servico}</strong> <span>${item.data} - ${item.hora}h</span>`;
      listaHorarios.appendChild(li);
    });
  }
});

