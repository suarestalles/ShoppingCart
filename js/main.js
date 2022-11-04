var list = [];

function subTotal(amount, value){
    return amount * value;
}

function getTotal(list){
    var total = 0;
    for(var key in list){
        total += subTotal(list[key].amount, list[key].value);
    }
    return total;
}

function formatValue(value){
    var str = parseFloat(value).toFixed(2);
    str = str.replace(".", ",");
    str = 'R$ ' + str;
    return str;
}

function formatDescription(description){
    var str = description.toLowerCase();
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str;
}

function setList(list){
    var table = '<thead>\n' +
        '                <tr>\n' +
        '                    <th>Descricão</th>\n' +
        '                    <th>Quantidade</th>\n' +
        '                    <th>Valor</th>\n' +
        '                    <th>Subtotal</th>\n' +
        '                    <th class="col-2">-</th>\n' +
        '                </tr>\n' +
        '                </thead>\n'+
        '               <tbody>';

    /*repeticao*/
    for (var key in list){
        table += '<tr>\n' +
            '      <td>'+formatDescription(list[key].description)+'</td>\n' +
            '      <td>'+list[key].amount+'</td>\n' +
            '      <td>'+formatValue(list[key].value)+'</td>\n' +
            '      <td>'+formatValue(subTotal(list[key].amount, list[key].value))+'</td>\n' +
            '      <td class="col-2">' +
            '           <button onclick="setUpdate('+key+')" class="btn btn-outline-primary">Edit</button>' +
            '           <button onclick="deleteData('+key+')" class="btn btn-outline-danger">Delete</button>' +
            '       </td>\n' +
            '     </tr>';
    }
    table += '</tbody>';
    document.getElementById("listTable").innerHTML = table;
    document.getElementById("totalValue").innerHTML = formatValue(getTotal(list));
    saveListStorage();
}

function deleteData(index){
    if (confirm('Deseja realmente excluir esse item?')){
        if (index === list.length - 1){
            list.pop();
        }else if (index === 0){
            list.shift();
        }else{
            var arrIni = list.slice(0, index);
            var arrFim = list.slice(index+1);
            list =  arrIni.concat(arrFim);
        }
        setList(list);
    }
}

function setUpdate(index){
    var item = list[index];
    document.getElementById("inputIdUpdate").value = index;
    document.getElementById("description").value = item.description;
    document.getElementById("amount").value = item.amount;
    document.getElementById("value").value = item.value;
    document.getElementById("btnAdd").style.display = "none";
    document.getElementById("btnUpdate").style.display = "inline-block";
}

function resetForm(){
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("value").value = "";
    document.getElementById("inputIdUpdate").value = "";
    document.getElementById("btnAdd").style.display = "inline-block";
    document.getElementById("btnUpdate").style.display = "none";
}

function updateData(){
    if (!validation()){
        return;
    }
    var id = document.getElementById("inputIdUpdate").value;
    var description = document.getElementById("description").value;
    var amount = document.getElementById("amount").value;
    var value = document.getElementById("value").value;
    list[id] = {"description":description, "amount":amount, "value":value};
    resetForm();
    setList(list);
}

function addData(){
    if (!validation()){
        return;
    }
    var description = document.getElementById("description").value;
    var amount = document.getElementById("amount").value;
    var value = document.getElementById("value").value;

    list.unshift({"description":description, "amount":amount, "value":value});
    resetForm();
    setList(list);
}

function validation(){
    var description = document.getElementById("description").value;
    var amount = parseInt('0'+document.getElementById("amount").value);
    var value = parseFloat('0'+document.getElementById("value").value);
    var errors = "";

    if (description === ""){
        errors += '<p>Informe a descricão</p>';
    }
    if (amount <= 0){
        errors += '<p>A quantidade deve ser maior do que zero</p>';
    }
    if (value <= 0){
        errors += '<p>O valor deve ser maior do que zero</p>';
    }

    if (errors != ""){
        document.getElementById("errors").style.display = "block";
        document.getElementById("errors").innerHTML = '<h3>Error</h3>' + errors;
        return 0;
    }
    document.getElementById("errors").style.display = "none";
    return 1;
}

function saveListStorage(){
    var jsonStr = JSON.stringify(list);
    localStorage.setItem("list", jsonStr);
}

function initListStorage(){
    var testList = localStorage.getItem("list");
    if(testList){
        list = JSON.parse(testList);
    }
    setList(list);
}

initListStorage();