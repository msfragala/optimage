<script>
  import { version } from '../../package.json';
  import Output from './output.svelte';
  import SizesField from './sizes-field.svelte';
  import UploadField from './upload-field.svelte';
</script>

<div class="container">
  <main class="main">
    <h1 class="heading">Optimage</h1>
    <form class="form" novalidate action="">
      <SizesField />
      <UploadField />
    </form>
    <Output />
  </main>
  <footer class="footer">
    <p>&copy; Mitchell Fragala</p>
    <p>
      <a href="https://github.com/msfragala/optimage">v{version}</a>
    </p>
  </footer>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    max-width: 40rem;
    margin-inline: auto;
    padding: 4rem 1.5rem 3rem;
    box-sizing: border-box;
  }

  .heading {
    font-size: 3.75rem;
    font-weight: 600;
    margin-block-end: 4rem;
    text-align: center;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    margin-block-start: auto;
    padding-block-start: 96px;
    font-size: var(--text-xs);
    color: var(--color-text-soft);
  }

  .footer a:hover {
    text-decoration: underline;
  }
</style>
