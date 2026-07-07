# ScoreOps ⚽

Application de scores football en temps réel, déployée avec une pipeline DevOps complète.

🔗 **https://scoreops.fr**

## Stack technique

- **Frontend** : React + Vite + Tailwind CSS (servi par Nginx)
- **Backend** : Node.js + Express + SQLite
- **Data source** : football-data.org (API gratuite)

## Infrastructure & DevOps

- **Conteneurisation** : Docker (backend `node:20-slim`, frontend `nginx:alpine`)
- **Orchestration** : Kubernetes (K3s) sur OVH Public Cloud
- **IaC** : Terraform (provider OpenStack) + Ansible (playbook de configuration complète)
- **CI/CD** : GitHub Actions (build, scan Trivy, deploy SSH)
- **HTTPS** : cert-manager + Let's Encrypt (automatique)
- **Ingress** : Traefik
- **Sécurité** : Trivy (scan d'images), fail2ban, SSH key-only

## Pipeline CI/CD

Chaque push sur `main` déclenche :

1. **Build** des images Docker
2. **Scan Trivy** (vulnérabilités HIGH/CRITICAL)
3. **Deploy SSH** sur le serveur (pull, build, import K3s, rollout restart)

## Déploiement automatisé

```bash
cd terraform
terraform apply
```

Une seule commande provisionne l'instance OVH et lance Ansible qui installe Docker, K3s, clone le repo, build les images, scanne avec Trivy, déploie les manifests K8s et configure le HTTPS.

## Structure du projet

├── backend/           # API Node.js + Express
├── frontend/          # React + Vite + Tailwind
├── k8s/               # Manifests Kubernetes
├── terraform/         # Infrastructure as Code
├── ansible/           # Playbook de configuration
├── monitoring/        # Prometheus + Grafana
├── .github/workflows/ # Pipeline CI/CD
└── docker-compose.yml

## Auteur

**Lassana Sylla** — Projet de formation DevOps
