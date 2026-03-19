import AppShell from '@/components/AppShell';
import Link from 'next/link';

export default function ManualPage() {
  return (
    <AppShell>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #14344A 0%, #1A5276 100%)' }} className="text-white px-8 py-10">
        <h2 className="text-3xl font-bold tracking-tight">📖 Manual de Uso do App</h2>
        <p className="text-white/75 mt-2 text-sm max-w-lg">Guia completo para operar a plataforma de Extração de Desafios — Campanha de Inovação IDG</p>
        <span className="inline-block mt-4 bg-white/15 border border-white/20 text-xs font-medium px-4 py-1 rounded-full">Challenge Canvas + Entrevista Estruturada</span>
      </div>

      <div className="px-8 py-8 max-w-4xl">

        {/* Índice */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
          <h3 className="font-bold text-[#14344A] text-base mb-4">📋 Índice</h3>
          <ol className="space-y-1 text-sm">
            {[
              ['#visao-geral', '1. Visão Geral do Sistema'],
              ['#dashboard', '2. Dashboard'],
              ['#nova-entrevista', '3. Criar Nova Entrevista'],
              ['#formulario', '4. Formulário de Entrevista e Transcrição'],
              ['#canvas', '5. Challenge Canvas'],
              ['#relatorio', '6. Relatório de Sessão'],
              ['#admin', '7. Administração (Perguntas e Cargos)'],
              ['#pin', '8. Níveis de Acesso e PIN'],
              ['#lixeira', '9. Lixeira'],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-blue-600 hover:underline">{label}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* 1. Visão Geral */}
        <section id="visao-geral" className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#14344A' }}>1</div>
            <h3 className="font-bold text-[#14344A] text-xl">Visão Geral do Sistema</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-4">
              O <strong>App de Extração de Desafios</strong> é uma plataforma estruturada para conduzir entrevistas com diretores e comitês das 5 diretorias do IDG, com o objetivo de identificar e registrar desafios reais de produtividade para a Campanha de Inovação.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                { icon: '🎙️', title: 'Entrevista Guiada', desc: 'Roteiro estruturado em 4 fases com perguntas calibradas para cada diretoria.' },
                { icon: '🧩', title: 'Challenge Canvas', desc: 'Preenchimento automático do canvas com base nas respostas da entrevista.' },
                { icon: '📊', title: 'Relatório Final', desc: 'Geração de relatório imprimível com todos os dados da sessão.' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg p-4 text-center" style={{ background: '#F0F4F8' }}>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-semibold text-sm text-[#14344A] mb-1">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-4 border-l-4 border-blue-500 bg-blue-50 text-sm text-blue-800">
              <strong>5 Diretorias atendidas:</strong> Engenharia · Gerenciamento e Fiscalização · Comitê de ESG · Óleo &amp; Gás · Comercial
            </div>
          </div>
        </section>

        {/* 2. Dashboard */}
        <section id="dashboard" className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#2980B9' }}>2</div>
            <h3 className="font-bold text-[#14344A] text-xl">Dashboard</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-4">A tela inicial exibe um panorama de todas as sessões de entrevista registradas no sistema.</p>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                ['🏠', 'Listagem de todas as sessões', 'Nome do entrevistado, cargo, diretoria, data de criação e status.'],
                ['🔍', 'Busca e filtros', 'Filtre sessões por diretoria para encontrar entrevistas rapidamente.'],
                ['🔗', 'Acesso rápido', 'Clique em qualquer sessão para abrir o formulário, canvas ou relatório.'],
                ['➕', 'Nova Entrevista', 'Botão de atalho para iniciar uma nova sessão diretamente pelo dashboard.'],
              ].map(([icon, title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div>
                    <span className="font-semibold text-[#14344A]">{title}: </span>
                    <span className="text-gray-500">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Nova Entrevista */}
        <section id="nova-entrevista" className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#1ABC9C' }}>3</div>
            <h3 className="font-bold text-[#14344A] text-xl">Criar Nova Entrevista</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-4">Acesse <strong>Nova Entrevista</strong> no menu lateral ou pelo botão no dashboard.</p>
            <div className="space-y-4">
              {[
                { step: '1', color: '#1ABC9C', title: 'Preencha os dados do entrevistado', desc: 'Informe o nome completo, cargo e selecione a diretoria correspondente (Engenharia, Gerenciamento, ESG, Óleo & Gás ou Comercial).' },
                { step: '2', color: '#E67E22', title: 'Escolha o modo de entrevista', desc: 'Entrevista interna (conduzida pelo app) ou envio de link público para o entrevistado responder de forma assíncrona.' },
                { step: '3', color: '#E74C3C', title: 'Inicie a sessão', desc: 'Clique em "Criar Sessão". O sistema carregará automaticamente as perguntas configuradas para a diretoria selecionada.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex w-7 h-7 rounded-full items-center justify-center text-white text-xs font-bold" style={{ background: item.color }}>{item.step}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#14344A]">{item.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Formulário e Transcrição */}
        <section id="formulario" className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#E67E22' }}>4</div>
            <h3 className="font-bold text-[#14344A] text-xl">Formulário de Entrevista e Transcrição</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-5">O formulário apresenta cada pergunta do roteiro com um campo de resposta textual e um botão de gravação de voz.</p>

            {/* Link Público */}
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 mb-5">
              <h4 className="font-semibold text-teal-800 text-sm mb-2">🔗 Copiar e Enviar o Link Público da Entrevista</h4>
              <p className="text-sm text-teal-700 mb-3">
                Após criar a sessão, o app exibe um botão <span className="inline-block bg-teal-200 rounded px-2 py-0.5 font-mono text-xs font-medium">🔗 Copiar link público</span> no cabeçalho da página de entrevista. Use-o quando o entrevistado vai responder de forma <strong>assíncrona</strong>, sem a presença do entrevistador.
              </p>
              <ol className="space-y-2 text-sm text-teal-700 mb-3">
                <li><span className="font-bold">1.</span> Crie a sessão normalmente em <strong>Nova Entrevista</strong>.</li>
                <li><span className="font-bold">2.</span> Na página da sessão, clique em <span className="inline-block bg-teal-200 rounded px-2 py-0.5 font-mono text-xs">🔗 Copiar link público</span> — o link é copiado para a área de transferência.</li>
                <li><span className="font-bold">3.</span> Cole e envie o link para o entrevistado por e-mail, WhatsApp ou outro canal.</li>
                <li><span className="font-bold">4.</span> O entrevistado acessa o link e responde diretamente pelo próprio dispositivo, no seu tempo.</li>
                <li><span className="font-bold">5.</span> As respostas são salvas automaticamente e ficam disponíveis na sessão para o entrevistador revisar.</li>
              </ol>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white/70 rounded-lg text-xs text-teal-800">
                  <div className="font-semibold mb-1">✅ O entrevistado vê:</div>
                  <ul className="space-y-0.5 text-teal-700">
                    <li>• Formulário com todas as perguntas da sessão</li>
                    <li>• Campo de texto para cada resposta</li>
                    <li>• Botão de transcrição por voz</li>
                  </ul>
                </div>
                <div className="p-3 bg-white/70 rounded-lg text-xs text-teal-800">
                  <div className="font-semibold mb-1">🚫 O entrevistado <em>não</em> vê:</div>
                  <ul className="space-y-0.5 text-teal-700">
                    <li>• Challenge Canvas</li>
                    <li>• Relatório da sessão</li>
                    <li>• Outras sessões do sistema</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Transcrição */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-5">
              <h4 className="font-semibold text-blue-800 text-sm mb-2">🎤 Como usar a Transcrição por Voz</h4>
              <ol className="space-y-2 text-sm text-blue-700">
                <li><span className="font-bold">1.</span> Clique no botão do microfone <span className="inline-block bg-blue-200 rounded px-2 py-0.5 font-mono text-xs">🎙️</span> ao lado do campo de resposta.</li>
                <li><span className="font-bold">2.</span> Fale a resposta do entrevistado normalmente — o áudio é capturado em tempo real.</li>
                <li><span className="font-bold">3.</span> Clique novamente para <strong>parar</strong> a gravação.</li>
                <li><span className="font-bold">4.</span> O sistema transcreve automaticamente o áudio e insere o texto no campo de resposta.</li>
                <li><span className="font-bold">5.</span> Edite o texto transcrito se necessário antes de salvar.</li>
              </ol>
              <div className="mt-3 p-2 bg-white/60 rounded text-xs text-blue-600">
                <strong>Dica:</strong> Fale em ambiente silencioso e próximo ao microfone para obter melhor precisão na transcrição.
              </div>
            </div>

            {/* Salvamento */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-[#14344A] text-sm mb-2">💾 Salvamento de Respostas</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-green-500 font-bold flex-shrink-0">•</span> As respostas são salvas individualmente por pergunta ao clicar em <strong>Salvar</strong>.</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold flex-shrink-0">•</span> É possível retornar à sessão mais tarde para complementar ou editar respostas já salvas.</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold flex-shrink-0">•</span> Ao finalizar, clique em <strong>Concluir Entrevista</strong> para avançar ao Challenge Canvas.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Challenge Canvas */}
        <section id="canvas" className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#8E44AD' }}>5</div>
            <h3 className="font-bold text-[#14344A] text-xl">Challenge Canvas</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-4">O Challenge Canvas é o documento estruturado que sintetiza o desafio identificado durante a entrevista.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {[
                { icon: '🧩', label: 'Contexto do Desafio', desc: 'Descrição geral do processo e do problema identificado.' },
                { icon: '⚡', label: 'Impacto Quantificado', desc: 'Dados numéricos que evidenciam a dimensão do problema.' },
                { icon: '🔍', label: 'Causa-Raiz', desc: 'Análise dos 5 Porquês para identificar a origem real.' },
                { icon: '👥', label: 'Stakeholders Afetados', desc: 'Equipes e pessoas impactadas pelo desafio.' },
                { icon: '🚫', label: 'Tentativas Anteriores', desc: 'O que já foi tentado e por que não funcionou.' },
                { icon: '💡', label: 'Declaração HMW', desc: '"Como poderíamos..." — síntese inspiradora do desafio.' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-xs text-[#14344A]">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-3 border-l-4 border-purple-500 bg-purple-50 text-xs text-purple-800">
              <strong>Após preencher o canvas:</strong> Valide a declaração HMW com o diretor entrevistado antes de finalizar. O canvas pode ser editado quantas vezes forem necessárias.
            </div>
          </div>
        </section>

        {/* 6. Relatório */}
        <section id="relatorio" className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#E74C3C' }}>6</div>
            <h3 className="font-bold text-[#14344A] text-xl">Relatório de Sessão</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-4">O relatório consolida todas as informações da sessão em um documento formatado, pronto para impressão ou compartilhamento.</p>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                ['📄', 'Dados do entrevistado', 'Nome, cargo, diretoria e data da entrevista.'],
                ['💬', 'Transcrição das respostas', 'Todas as perguntas e respectivas respostas registradas.'],
                ['🧩', 'Síntese do Canvas', 'Resumo estruturado do Challenge Canvas preenchido.'],
                ['🖨️', 'Impressão', 'Use o botão "Imprimir" para gerar um PDF formatado diretamente do navegador.'],
              ].map(([icon, title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div>
                    <span className="font-semibold text-[#14344A]">{title}: </span>
                    <span className="text-gray-500">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. Administração */}
        <section id="admin" className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#2C3E50' }}>7</div>
            <h3 className="font-bold text-[#14344A] text-xl">Administração</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-4 text-xs text-amber-700">
              <strong>⚠️ Acesso restrito:</strong> As telas de administração são protegidas por PIN. Acesso exclusivo para gestores da Gerência de Inovação.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-[#14344A] text-sm mb-2">⚙️ Perguntas</h4>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  <li className="flex gap-1.5"><span className="text-blue-500">•</span> Gerencie o banco de perguntas do roteiro de entrevista.</li>
                  <li className="flex gap-1.5"><span className="text-blue-500">•</span> Adicione, edite ou remova perguntas por diretoria.</li>
                  <li className="flex gap-1.5"><span className="text-blue-500">•</span> Defina a fase e a ordem de cada pergunta no roteiro.</li>
                </ul>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-[#14344A] text-sm mb-2">🏢 Cargos</h4>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  <li className="flex gap-1.5"><span className="text-blue-500">•</span> Cadastre os cargos dos entrevistados para seleção no formulário.</li>
                  <li className="flex gap-1.5"><span className="text-blue-500">•</span> Associe cada cargo à sua respectiva diretoria.</li>
                  <li className="flex gap-1.5"><span className="text-blue-500">•</span> Mantenha a lista atualizada conforme as mudanças organizacionais.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8. PIN */}
        <section id="pin" className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#C0392B' }}>8</div>
            <h3 className="font-bold text-[#14344A] text-xl">Níveis de Acesso e PIN</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-5">
              O app possui dois perfis de usuário com diferentes níveis de acesso. O PIN é a senha numérica definida pelo gestor da Gerência de Inovação na variável <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">ADMIN_PIN</span> do ambiente do Vercel.
            </p>

            {/* Tabela de perfis */}
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr style={{ background: '#14344A' }}>
                    <th className="text-white text-left p-3 font-semibold">Perfil</th>
                    <th className="text-white text-left p-3 font-semibold">Quem é</th>
                    <th className="text-white text-left p-3 font-semibold">Requer PIN?</th>
                    <th className="text-white text-left p-3 font-semibold">O que pode acessar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50">
                    <td className="p-3 font-semibold text-blue-800">👤 Entrevistado</td>
                    <td className="p-3 text-gray-600">Diretor ou membro de comitê que recebeu o link público</td>
                    <td className="p-3 text-green-700 font-medium">Não</td>
                    <td className="p-3 text-gray-600">Somente o formulário público <span className="font-mono text-xs bg-gray-100 px-1 rounded">/responder/[id]</span></td>
                  </tr>
                  <tr className="bg-orange-50">
                    <td className="p-3 font-semibold text-orange-800">🎙️ Entrevistador</td>
                    <td className="p-3 text-gray-600">Membro da equipe de inovação que conduz a entrevista</td>
                    <td className="p-3 text-green-700 font-medium">Não (navegação geral)</td>
                    <td className="p-3 text-gray-600">Dashboard, Nova Entrevista, formulário de sessão, Dicas, Manual</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="p-3 font-semibold text-red-800">🔐 Gestor / Admin</td>
                    <td className="p-3 text-gray-600">Gerente de Inovação ou responsável pelo sistema</td>
                    <td className="p-3 text-red-700 font-bold">Sim — PIN obrigatório</td>
                    <td className="p-3 text-gray-600">Canvas, Relatório, Admin Perguntas, Admin Cargos</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quando o PIN é pedido */}
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 mb-4">
              <h4 className="font-semibold text-red-800 text-sm mb-3">🔒 Páginas que exigem PIN</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { icon: '🧩', page: 'Challenge Canvas', path: '/canvas/[id]', desc: 'Síntese e edição do desafio' },
                  { icon: '📊', page: 'Relatório de Sessão', path: '/relatorio/[id]', desc: 'Documento final da entrevista' },
                  { icon: '⚙️', page: 'Admin — Perguntas', path: '/admin/perguntas', desc: 'Gerenciamento do roteiro' },
                  { icon: '🏢', page: 'Admin — Cargos', path: '/admin/cargos', desc: 'Cadastro de cargos' },
                ].map((item) => (
                  <div key={item.page} className="flex items-start gap-2 bg-white/70 rounded-lg p-2.5">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-xs text-[#14344A]">{item.page}</div>
                      <div className="font-mono text-[10px] text-gray-400">{item.path}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Como funciona o PIN */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-[#14344A] text-sm mb-2">ℹ️ Como funciona</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-red-400 font-bold flex-shrink-0">•</span> Ao acessar uma página protegida, um modal solicita o PIN antes de exibir o conteúdo.</li>
                <li className="flex gap-2"><span className="text-red-400 font-bold flex-shrink-0">•</span> Após validação correta, o acesso é liberado para <strong>toda a sessão do navegador</strong> — não é preciso digitar novamente enquanto a aba estiver aberta.</li>
                <li className="flex gap-2"><span className="text-red-400 font-bold flex-shrink-0">•</span> Fechar o navegador ou a aba encerra a sessão; o PIN será solicitado novamente no próximo acesso.</li>
                <li className="flex gap-2"><span className="text-red-400 font-bold flex-shrink-0">•</span> O PIN é configurado pelo administrador do sistema na variável de ambiente <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs">ADMIN_PIN</span> no Vercel.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Lixeira */}
        <section id="lixeira" className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#7F8C8D' }}>9</div>
            <h3 className="font-bold text-[#14344A] text-xl">Lixeira</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-4">Sessões excluídas são movidas para a Lixeira e podem ser recuperadas antes da exclusão permanente.</p>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                ['🗑️', 'Exclusão suave', 'Ao excluir uma sessão no dashboard, ela vai para a lixeira (não é deletada permanentemente).'],
                ['♻️', 'Restaurar sessão', 'Clique em "Restaurar" para devolver a sessão ao dashboard.'],
                ['❌', 'Exclusão permanente', 'Use "Excluir definitivamente" para remover a sessão de forma irreversível.'],
              ].map(([icon, title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div>
                    <span className="font-semibold text-[#14344A]">{title}: </span>
                    <span className="text-gray-500">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Rodapé CTA */}
        <div className="rounded-xl p-6 text-center text-white mb-4" style={{ background: 'linear-gradient(135deg, #14344A 0%, #2980B9 100%)' }}>
          <p className="text-sm font-light mb-4 opacity-80">Pronto para começar? Acesse o guia de dicas e inicie sua primeira entrevista.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/guia" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-white/20 border border-white/30 hover:bg-white/30 transition-colors">
              📘 Dicas para Entrevista
            </Link>
            <Link href="/nova" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm" style={{ background: 'var(--c-primary)' }}>
              🎙️ Nova Entrevista
            </Link>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
