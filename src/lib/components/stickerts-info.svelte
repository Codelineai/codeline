<script lang="ts">
  const capabilities = [
    "Publica cromos con foto, precio y ubicación",
    "Filtra por país, ciudad, álbum, número y tipo de publicación.",
    "Contacto directo por WhatsApp o correo con el vendedor",
  ];
</script>

<div class="flex flex-col gap-4">
  <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
    Una aplicación web para comprar, vender e intercambiar cromos entre
    coleccionistas. Con <span class="text-foreground">Stickerts</span> puedes encontrar
    los stickers que te faltan y vender tus repetidos.
  </p>

  <ul class="flex flex-col gap-2.5">
    {#each capabilities as capability (capability)}
      <li
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
      Motivación
    </span>
    <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
      Creé esta plataforma porque noté que no existía una solución para
      encontrar los cromos que te hacen falta entre coleccionistas cercanos y
      poder comprarlos o intercambiarlos. Tampoco había un espacio centralizado
      para vender cromos valiosos, así que la idea fue organizar y darle mayor
      visibilidad a un mercado que funciona de manera informal.
    </p>
  </div>
</div>
