# To-Do Project

## Fullstack-Web-Entwicklung mit Symfony und React

Dieses Projekt ist eine **Fullstack-Web-Applikation**, die ein **Symfony-Backend** mit einer **React-Frontend-Oberfläche** kombiniert. Die App ermöglicht es Benutzern, **To-Do-Listen** zu verwalten, Aufgaben zu erstellen, zu bearbeiten, zu löschen und als erledigt zu markieren.

---

## Technologie-Stack

- **Backend:** Symfony 7 mit Doctrine ORM
- **Frontend:** React mit Bootstrap
- **Datenbank:** MySQL (Online-Datenbank-Anbieter)
- **API-Schnittstelle:** REST-API mit CRUD-Operationen

---

## Datenbankstruktur (MySQL & Doctrine ORM)
#### Symfony nutzt Doctrine ORM, um mit einer extern gehosteten MySQL-Datenbank zu kommunizieren.

Die zentrale Task-Tabelle (Task.php) besitzt folgende Felder:

| Feld         | Typ                 | Beschreibung                        |
|-------------|----------------------|-------------------------------------|
| `id`        | `INT (Auto Increment)` | Eindeutige ID für jeden Task       |
| `userId`    | `VARCHAR(36)`         | UUID des Benutzers                 |
| `title`     | `VARCHAR(255)`        | Titel der Aufgabe                  |
| `isCompleted` | `BOOLEAN (Default: false)` | Zeigt an, ob die Aufgabe erledigt ist |
| `createdAt` | `DATETIME`            | Zeitstempel der Erstellung         |

## Datenbankverwaltung

- Die **Datenbankverbindung** wurde in der `.env`-Datei definiert.
- Tabellen wurden mit folgenden Symfony-Befehlen erstellt und aktualisiert:

```bash
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

---

## Symfony REST-API (TaskController.php)

Symfony stellt eine REST-API bereit, die CRUD-Operationen (Create, Read, Update, Delete) unterstützt.

### API-Routen:
| Methode | Endpunkt           | Beschreibung                         |
|---------|--------------------|-------------------------------------|
| `GET`   | `/api/tasks`       | Alle Tasks des aktuellen Benutzers abrufen |
| `POST`  | `/api/tasks`       | Einen neuen Task erstellen          |
| `PUT`   | `/api/tasks/{id}`  | Einen bestehenden Task bearbeiten   |
| `DELETE`| `/api/tasks/{id}`  | Einen Task löschen                  |

- Nur der Besitzer (UUID) sieht seine eigenen Tasks.
- Erledigte Tasks können nicht mehr bearbeitet werden, außer man setzt sie zurück auf "unerledigt".
- Löschen ist immer möglich.

---

## Frontend mit React & Bootstrap

Das Frontend wurde mit **React** entwickelt und nutzt **Bootstrap** für das Styling.  

### Funktionen der To-Do-Liste:

- **Eingabefeld** für neue Tasks
- **Hinzufügen-Button**
- **Erledigt-Checkbox** (Task wird grün hervorgehoben)
- **Bearbeiten-Button** (Nicht sichtbar bei erledigten Tasks)
- **Löschen-Button** (Immer sichtbar)

---

## Automatische Benutzer-Identifikation (UUID)

Beim ersten Besuch der Seite wird eine **UUID im Local Storage** des Browsers gespeichert.  
Diese UUID wird bei jeder API-Anfrage mitgesendet, sodass Benutzer nur ihre eigenen Aufgaben sehen und bearbeiten können.

---
## HTTP-Anfragen mit Fetch
Das React-Frontend kommuniziert mit der API über fetch(), wobei folgende Methoden genutzt werden:

- GET → Tasks abrufen
- POST → Neuen Task hinzufügen
- PUT → Task bearbeiten
- DELETE → Task löschen

---


## Fazit & Weiterentwicklung

✅ **Aktueller Stand:**
- API ist **voll funktionsfähig** (CRUD-Operationen)
- React-Frontend ist mit der API **verbunden**
- **Nur eigene Tasks sind sichtbar**, dank UUID

💡 **Mögliche Erweiterungen:**
- **Login-System** (Google, Facebook, E-Mail)
- **Mehrere Listen** z. B. für verschiedene Kategorien
- **Drag & Drop** für Sortierung der Tasks

---

**Dieses Projekt ist eine voll funktionsfähige To-Do-App mit Symfony & React, die einfach erweitert werden kann.** 
