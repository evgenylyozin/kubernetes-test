# ubuntu-18.04 предварительно скачан: https://app.vagrantup.com/bento/boxes/ubuntu-18.04
# и добавлен вручную через vagrant box add
servers = [
    {
        :name => "node-1",
        :type => "head-node",
        :box => "ubuntu-18.04",
        :eth1 => "192.168.56.2",
        :mem => "3072",
        :cpu => "2"
    },
    {
        :name => "node-2",
        :type => "next-node",
        :box => "ubuntu-18.04",
        :eth1 => "192.168.56.3",
        :mem => "3072",
        :cpu => "2"
    },
    {
        :name => "node-3",
        :type => "next-node",
        :box => "ubuntu-18.04",
        :eth1 => "192.168.56.4",
        :mem => "3072",
        :cpu => "2"
    }
]

$get_join_string = <<-SCRIPT
  echo Получаем строку для подключения нод к главной ноде...
  export DATA=$(microk8s add-node)
  echo Сохраняем строку для подключения нод к главной ноде в файл, который появится рядом с Vagrantfile...
  export JOIN_STRING=${DATA:90:53}
  echo microk8s join $1$JOIN_STRING > /vagrant/join.sh
SCRIPT

$join_cluster = <<-SCRIPT
  echo Подключаемся к контролирующей ноде...
  chmod +x join.sh
  ./join.sh
  echo Нода подключена.
SCRIPT

$init_up_sh = <<-SCRIPT
  chmod +x up.sh
SCRIPT

$setting_up_node_script = <<-SCRIPT
  echo Добавим резолв ip воркер-серверов в /etc/hosts
  echo "192.168.56.2 node-1" | sudo tee -a /etc/hosts
  echo "192.168.56.3 node-2" | sudo tee -a /etc/hosts
  echo "192.168.56.4 node-3" | sudo tee -a /etc/hosts
  echo Корректировака IPtables forward policy...
  sudo iptables -P FORWARD ACCEPT
  echo Добавим daemon.json
  echo -e '{\n\t"insecure-registries": ["localhost:32000"]\n}' | sudo tee /etc/docker/daemon.json
  echo Перезагрузим докер в связи с добавлением daemon.json
  sudo systemctl restart docker
  echo Установка microk8s...
  sudo snap install microk8s --classic --channel=1.25/stable
  microk8s status --wait-ready
  sudo usermod -a -G microk8s vagrant
  sudo chown -f -R vagrant ~/.kube
  newgrp microk8s 
  SCRIPT

Vagrant.configure("2") do |config|
  servers.each do |opts|
    config.vm.define opts[:name] do |config|
      config.vm.box = opts[:box]
      config.vm.hostname = opts[:name]
      config.vm.network "private_network", ip: opts[:eth1],
        virtualbox__intnet: "internal_net"
      config.vm.provider "virtualbox" do |v|
        v.name = opts[:name]
        v.customize ["modifyvm", :id, "--memory", opts[:mem]]
        v.customize ["modifyvm", :id, "--cpus", opts[:cpu]]
      end
      # установить и настроить докер
      config.vm.provision "docker"
      config.vm.provision "shell", inline: $setting_up_node_script
      if opts[:type] == "head-node"
        # передать файл настроек стака кубернета
        config.vm.provision "file", source: "~/development/kubernetes-test/kubernetes.yml", destination: "kubernetes.yml"
        config.vm.provision "file", source: "~/development/kubernetes-test/up.sh", destination: "up.sh"
        config.vm.provision "shell", inline: $init_up_sh
        config.vm.provision "shell" do |s|
          s.inline = $get_join_string
          s.args = [opts[:eth1]]
        end
      else
        # передать файл join.sh
        config.vm.provision "file", source: "~/development/kubernetes-test/join.sh", destination: "join.sh"
        config.vm.provision "shell", inline: $join_cluster
        config.vm.provision "shell" do |s|
          s.inline = $get_join_string
          s.args = [opts[:eth1]]
        end
      end
    end
  end
end