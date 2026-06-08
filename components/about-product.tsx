function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-xs text-foreground">
          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-foreground/60" />
          {item}
        </li>
      ))}
    </ul>
  )
}

const highlights = [
  "Tecido leve e confortável",
  "Alta respirabilidade",
  "Tecnologia de controle de umidade",
  "Secagem rápida",
  "Caimento moderno e anatômico",
  "Ideal para jogos e uso casual",
  "Versões Home e Away inclusas",
  "Personalização disponível por fonte oficial",
]

const importantInfo = [
  "Os produtos podem sofrer variação de 1 cm a 2,5 cm nas medidas",
  "Recomendamos escolher um tamanho maior",
  "Produtos personalizados não possuem troca ou devolução",
  "Estoque sujeito à disponibilidade",
  "Em caso de indisponibilidade, o valor será reembolsado integralmente",
]

const care = [
  "Não utilizar amaciante",
  "Lavar e passar do lado avesso",
  "Não utilizar água quente ou alvejante",
  "Lavar com cores similares",
  "Retirar da máquina imediatamente após a lavagem",
]

export function AboutProduct() {
  return (
    <section className="mt-2 bg-card px-4 py-4">
      <p className="text-[10px] font-bold tracking-wider text-muted-foreground">SOBRE ESTE PRODUTO</p>
      <p className="mt-3 text-center text-[11px] font-bold tracking-widest text-yellow-600">
        PROMOÇÃO ESPECIAL COPA DO MUNDO 2026™
      </p>
      <h2 className="mt-2 text-center text-3xl font-black leading-tight text-foreground">
        COMPRE 1 E
        <br />
        LEVE 2
      </h2>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Vista a paixão nacional com a dobradinha histórica da Copa do Mundo 2026™.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-foreground">
        A <b>Camisa Brasil Home + Away 2026</b> combina tradição, desempenho e estilo para os torcedores que vivem cada
        jogo intensamente.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground">
        O kit reúne as duas versões da Seleção Brasileira: o clássico uniforme amarelo Home e a elegante camisa azul
        Away, inspirada nas cores da bandeira nacional.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground">
        Produzidas em tecido leve e respirável com tecnologia de secagem rápida, oferecem conforto, ventilação e
        excelente caimento para acompanhar você nos jogos, no dia a dia ou na coleção.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-foreground">Destaques do Produto</h3>
        <BulletList items={highlights} />
      </div>

      <h3 className="mt-5 text-base font-bold">Personalização</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        As camisas não acompanham nome e número personalizados.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        Para adicionar personalização, selecione a opção <b>{'"Somente Personalizado"'}</b> antes de finalizar sua
        compra e informe o nome e o número desejados.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-foreground">Informações Importantes</h3>
        <BulletList items={importantInfo} />
      </div>

      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-foreground">Cuidados com a Peça</h3>
        <BulletList items={care} />
      </div>

      <p className="mt-5 text-center text-sm font-semibold text-brand-green">Vista as cores da paixão nacional.</p>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        Viva cada momento da Copa do Mundo 2026™ com estilo, orgulho e atitude.
      </p>
    </section>
  )
}
