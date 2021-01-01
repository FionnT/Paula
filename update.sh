git pull
tmux kill-ses -t Backend 
tmux new-session -d -s Backend 
tmux send-keys 'cd /var/www/paula/server && npm i && npm run prod' C-m
tmux detach -s Backend 
cd /var/www/paula 
npm run build