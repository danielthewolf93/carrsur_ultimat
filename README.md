## Required Components For ODBC MSSql Connection

1. sudo apt-get install unixodbc unixodbc-dev
2. sudo apt install tdsodbc
3. npm install odbc
4. Create an entry like this:

   sudo nano -w /etc/odbcinst.ini

   [FreeTDS]
   DESCRIPTION=FreeTDS ODBC driver
   DRIVER=/usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so

5. Next we use sudo nano -w /etc/odbc.ini to create another entry:

   [SQLServer01]
   DRIVER=FreeTDS
   SERVER=192.168.0.179
   PORT=49242
   DATABASE=myDb
   TDS_Version=7.2

6. Finally, we can connect via isql (note the double backslash):

   Open Terminal and Run: isql SQLServer01 mydomain\\myusername mypassword

7. Add 'ftp' package to connect with server

   npm install ftp

8. Add WooCommerce package to connect with WC Apis

   npm install --save @woocommerce/woocommerce-rest-api
