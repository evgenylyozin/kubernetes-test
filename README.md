# Тест кубернет кластера

Раскатываю сервер по нескольким машинам, созданным через Vagrant
Сервер упакован в докер образ и поднимается через Kubernetes

## Последовательность для тестирования

- Поднять виртуальные машины

```bash
vagrant up --provision
```

- Зайти в первую ноду и поднять стак кубернета

```bash
sudo ./up.sh
```

- В корне проекта должен появиться pods.data.txt, проверить, что поды распределены по нодам

- Чтобы проверить, что все сервера отвечают на запрос, внутри первой ноды выполнить:

см http-server-deployment cluster ip

```bash
microk8s kubectl get services
```

потом

```bash
curl $clusterip:8081
```

## Доп. полезные команды

- Построить образ докера

```bash
docker build -t 'evgenylyozin/test-kuber-server:0.0.3' .
```
