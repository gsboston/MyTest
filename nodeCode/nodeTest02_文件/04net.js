// 网络通信模块，数据不走http协议时使用
const net = require('net');

// OSI七层参考模型
// 物理层>数据链路层>网络层（IP）>传输层（TCP）>会话层>表现层>应用层
// net就是传输层