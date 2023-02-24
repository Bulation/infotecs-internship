import Controller from './controller/controller';
import DataModel from './model/dataModel';
import AppView from './view/AppView';

new Controller(new DataModel(), new AppView(document.body)); // инициализируем контроллер, передаем в него модель и вьюху, в которую передаем body
