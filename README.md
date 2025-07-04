# HEEs Protocol

User Protocol Website of HEEs

## Repository Description

This Repository is a Frontend Development Repository for HEEs.

## Repository Require

- Node : v24.3.0
- Vite : 7.0.0
- Vue : 3.5.17
- Vue-Router : 4.5.1
- Element-Plus : 2.10.2
- Pinia : 3.0.3
- Axios : 1.10.0

## Repository Structure
```
hees_f_protocol
├── public                              # Public Static Files
├── src                                 # Project Main Content
    ├── apis                            # API to Backend Servers
    ├── assets                          # Internal Static Files
    ├── components                      # General Components
    ├── global                          # Global
    ├── interfaces                      # Interface Objects
    ├── lang                            # Language Setting for i18n
    ├── router
    ├── services                        # Functions in Project
    ├── stores                          # Data Status Management
    ├── utils                           # Tools in Project
    ├── views
    ├── App.vue
    ├── main.ts
    └── style.css
├── .env.dev                            # Environment Values in Development 
├── .env.prod                           # Environment Values in Production
├── .env.uat                            # Environment Values in UAT
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Develop in This Repository

At Root Path of This Repository & Run Commands Belong

### Before Using This Repository
- Build `.env.dev`
  ```
  # 應用 PORT
  VITE_APP_PORT = 9701
  
  # 代理前綴
  VITE_OMS_API = '/oms'
  
  # API Address
  VITE_OMS_API_URL = http://127.0.0.1:8000
  ```

- Install Relations
  ```
  npm install
  ```

- Test Server Activate
  ```
  npm run dev
  ```

### Package DIST
TODO
