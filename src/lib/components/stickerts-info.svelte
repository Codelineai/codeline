<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { prefersReducedMotion } from "svelte/motion";

  const capabilities = [
    "Publica cromos con foto, precio y ubicación",
    "Filtra por país, ciudad, álbum, número y tipo de publicación.",
    "Contacto directo por WhatsApp o correo con el vendedor",
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
    Una aplicación web para comprar, vender e intercambiar cromos entre
    coleccionistas. Con <span class="text-foreground">Stickerts</span> puedes encontrar
    los stickers que te faltan y vender tus repetidos.
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
      Lo creé para porque buscar cromos en chats y grupos era desordenado.
      Quería una forma centralizada de encontrar coleccionistas cercanos,
      intercambiar, comprar y listar cromos valiosos.
    </p>
  </div>
</div>
