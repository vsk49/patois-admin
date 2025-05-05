<template>
    <div class="mots-view">
        <h1>Liste des mots</h1>
        <div v-if="loading">Chargement...</div>
        <div v-else-if="error">{{ error }}</div>
        <table v-else>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Mot</th>
                    <th>Définition</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
</template>

<script setup>
</script>

<style scoped>
.mots-view {
    padding: 2rem;
    margin-left: 275px;
}
table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    border: 1px solid #ddd;
    padding: 0.5rem;
}
th {
    background: #f0f0f0;
}
</style>