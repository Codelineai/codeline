<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { prefersReducedMotion } from "svelte/motion";

  const capabilities = [
    "Ventas en línea y en boletería unificadas, con cuadres de caja y reportes automáticos.",
    "Facturación electrónica conectada a la contabilidad: cada venta genera y envía su factura autorizada, sin procesos manuales.",
    "Kioscos de autoservicio donde el visitante compra e imprime sus entradas de forma autónoma.",
    "Creación y gestión de eventos, precios y experiencias desde el mismo sistema.",
  ];

  // El panel completo ya hace fade en +page.svelte; aquí solo un desliz sutil
  // y escalonado, desactivado si el usuario prefiere menos movimiento.
  const flyIn = (i: number) =>
    prefersReducedMotion.current
      ? { duration: 0 }
      : { y: 6, duration: 350, delay: 80 + i * 60, easing: cubicOut };
</script>

<div class="flex flex-col gap-4">
  <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
    El sistema que centraliza y automatiza la operación comercial de <span
      class="text-foreground">Wiwa</span
    >
    (antes Zoológico de Quito), conectando ventas, operación, contabilidad y datos
    en una sola plataforma.
  </p>

  <ul class="flex flex-col gap-2.5">
    {#each capabilities as capability, i (capability)}
      <li
        in:fly|global={flyIn(i)}
        class="flex gap-2 text-sm leading-relaxed text-muted-foreground text-pretty"
      >
        <span class="select-none text-muted-foreground/60" aria-hidden="true"
          >–</span
        >
        <span>{capability}</span>
      </li>
    {/each}
  </ul>

  <p class="text-xs text-muted-foreground">
    En colaboración con <span class="text-foreground">Smartpass</span> ·
    <a
      href="https://wiwaquito.org"
      target="_blank"
      rel="noopener noreferrer"
      class="underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
    >
      wiwaquito.org
    </a>
  </p>
</div>
