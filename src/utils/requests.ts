import axios from 'axios'

const service = axios.create({
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
    },
});

export default service;
