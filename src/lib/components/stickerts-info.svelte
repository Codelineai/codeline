<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { prefersReducedMotion } from "svelte/motion";

  const capabilities = [
    "Publicá tus repes en segundos y ponelas a la vista de todos.",
    "Encontrá los cromos que te faltan y completá el álbum más rápido.",
    "Intercambio directo entre usuarios, sin intermediarios.",
    "Compra y venta abierta: un mercado real para tus figuritas.",
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
    El marketplace para comprar, vender e intercambiar los cromos del álbum del
    Mundial. <span class="text-foreground">Stickerts</span> conecta a coleccionistas
    para que las repetidas de unos completen el álbum de otros.
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

  <div class="flex flex-col gap-1.5">
    <span
      class="font-medium uppercase text-sm tracking-wide text-muted-foreground/70"
    >
      Por qué lo creé
    </span>
    <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
      Quería una forma pública y masiva de compartir los cromos repetidos y, de
      paso, abrir un mercado fácil para venderlos. Un proyecto que aprecio,
      construido en tan solo 5 días.
    </p>
  </div>
</div>
