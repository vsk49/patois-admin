<script setup>
const mainMargin = '275px'
</script>

<template>
  <div class="presentation-root">
    <div class="presentation-container">
      <div class="presentation-content">
        <h1>Patois Savoyard Admin Interface</h1>
        <p class="subtitle">Bienvenue dans le panneau d'administration pour la gestion de la base de données de notre application.</p>
        <div class="spacer" style="height:40px"></div>
        <p class="description">
          Cette interface vous permettra prochainement de gérer les mots de la base de données, d'ajouter, modifier ou supprimer des données liées au patois savoyard.<br><br>
          Merci de votre confiance.<br>
          <span class="signature">L'équipe Patois Savoyard</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'DashboardView',
    data() {
        return {
            databaseRecords: [
                { id: 1, name: 'Record 1', description: 'Sample description 1' },
                { id: 2, name: 'Record 2', description: 'Sample description 2' },
            ],
        };
    },
    methods: {
        createEntry() {
            // Placeholder: Code to create a new database entry
            alert('Create entry functionality not implemented yet.');
        },
        editEntry(item) {
            // Placeholder: Code to edit the selected entry
            if (item) {
                alert(`Edit record with ID ${item.id} - functionality not implemented yet.`);
            } else {
                alert('Please select a record to edit.');
            }
        },
        deleteEntry(item) {
            // Placeholder: Code to delete the selected entry
            if (item) {
                alert(`Delete record with ID ${item.id} - functionality not implemented yet.`);
            } else {
                alert('Please select a record to delete.');
            }
        },
        refreshData() {
            // Placeholder: Code to refresh the database records
            alert('Refresh functionality not implemented yet.');
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.presentation-root {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: v-bind(mainMargin);
}
.presentation-container {
  max-width: 600px;
  width: 100%;
  padding: 40px 32px;
  background: var(--container-bg);
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  position: relative;
}
.presentation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
  color: var(--primary);
  font-family: Arial, sans-serif;
}
.subtitle {
  font-size: 18px;
  color: var(--subtitle);
  margin-bottom: 0;
  font-family: Arial, sans-serif;
  text-align: center;
}
.description {
  font-size: 18px;
  color: var(--text);
  text-align: center;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}
.signature {
  display: block;
  margin-top: 24px;
  font-size: 16px;
  color: var(--primary);
  font-weight: bold;
  font-family: Arial, sans-serif;
}
.spacer {
  width: 100%;
}
.mots-view {
  background: var(--background);
  color: var(--text);
}
.add-form, table {
  background: var(--container-bg);
}
.search-bar, .add-form input, input[type="text"], input[type="password"] {
  background: var(--input-bg);
  border-color: var(--input-border);
  color: var(--text);
}
th {
  background: var(--table-header);
  color: var(--primary-dark);
}
tbody tr:hover {
  background: var(--table-row-hover);
}
</style>