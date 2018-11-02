/**
 * Admin page
 * @dev Allows contract owner create and manage default card template
 * @dev Used to generate hero when someone buy in marketplace
 * @dev CRUD base cards, only owner have permission
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

class DefaultName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            creating: false,
            quizId: 99,
            quizName: "Name of the quiz",
            questionText: "What do you want to ask?",
            option1: "Here is the option 1",
            option2: "Here is the option 2",
            option3: "Here is the option 3",
            option4: "Here is the option 4",


            quizsList: [
                {
                    name: "Developer",
                    questionsList: [
                        {
                            timeLimit: 30,
                            "description": "Trong các cuộc nói chuyện thông thường, thì bạn có phải là người chủ động nghĩ ra chuyện để nói?",
                            "optionsList": [{
                                "name": "Tôi rất trầm tính và thấy khó khăn để mở đầu cuộc hội thoại với bạn bè và mọi người",
                                "score": "4"
                            }, {
                                "name": "Tôi khá trầm tính và dè dặt",
                                "score": "3"
                            }, {
                                "name": "Tôi thường là người kể chuyện, nhưng ko tốt lắm",
                                "score": "2"
                            }, {
                                "name": "Tôi luôn có khả năng nghĩ ra chuyện để kể cho người khác nghe bất cứ lúc nào cần thiết",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Bạn có phải người chủ động giao tiếp?",
                            "type": "E"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn có thường xuyên giao tiếp, hẹn gặp bạn bè, đọc báo (lướt web, Facebook, xem video, xem blog, vlog) để cập nhật những tin tức, thông tin thú vị, mới nhất, nóng nhất, giá trị nhất?",
                            "optionsList": [{
                                "name": "Tôi luôn dành thời gian cho những thứ riêng tư của bản thân, và thay vào đó sẽ đợi để nghe người khác kể lại",
                                "score": "4"
                            }, {
                                "name": "Tôi tập trung cho những thứ riêng tư của bản thân và ít khi cập nhật tin tức, thông tin",
                                "score": "3"
                            }, {
                                "name": "Tôi cập nhật tin tức khá nhanh",
                                "score": "2"
                            }, {
                                "name": "Tôi thường cập nhật tin tức rất nhanh và kể lại cho người khác nghe",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Bạn có hay cập nhật tin tức?",
                            "type": "E"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn có coi trọng việc mở rộng các mối quan hệ, dù là xã giao?",
                            "optionsList": [{
                                "name": "Tôi không hề có các mối quan hệ xã giao, và chỉ chơi với 1, 2 người",
                                "score": "4"
                            }, {
                                "name": "Tôi ít khi giao tiếp, nói chuyện và mở rộng mối quan hệ với người khác",
                                "score": "3"
                            }, {
                                "name": "Tôi thường xuyên giao tiếp và dễ dàng nói chuyện với người lạ khi cần",
                                "score": "2"
                            }, {
                                "name": "Tôi đặc biệt thích mở rộng các mối quan hệ, dù là xã giao thì cũng rất quan trọng",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Bạn có hay mở rộng các mối quan hệ?",
                            "type": "E"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn có dễ dàng vừa nói chuyện với người xung quanh, vừa chat, nhắn tin với nhiều người, vừa nghe nhạc, đọc báo, học bài cùng lúc, đan xen nhau?",
                            "optionsList": [{
                                "name": "Tôi chỉ giỏi tập trung vào 1 việc và ko thích phải làm nhiều thứ cùng lúc, chat với nhiều người cùng lúc",
                                "score": "4"
                            }, {
                                "name": "Tôi thích sự tập trung và không thoải mái khi làm nhiều thứ cùng lúc, chat với nhiều người cùng lúc",
                                "score": "3"
                            }, {
                                "name": "Tôi thấy khá thoải mái khi làm nhiều việc đan xen, chat với nhiều người cùng lúc",
                                "score": "2"
                            }, {
                                "name": "Hàng ngày tôi thường phải bận rộn làm nhiều việc đan xen, nói chuyện, chat với nhiều người cùng lúc",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Bạn là người tập trung hay người đa nhiệm?",
                            "type": "E"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn có để ý tới việc ăn mặc đẹp để luôn thấy mình tự tin trước đám đông? Có thích mua sắm quần áo, trang sức, điện thoại, đồng hồ và xe?",
                            "optionsList": [{
                                "name": "Tôi không bao giờ soi gương và cũng chả bao giờ để ý tới ngoại hình của mình",
                                "score": "4"
                            }, {
                                "name": "Tôi ít khi soi gương và ít quan tâm tới ngoại hình",
                                "score": "3"
                            }, {
                                "name": "Tôi khá quan tâm tới ngoại hình",
                                "score": "2"
                            }, {
                                "name": "Với tôi, ngoại hình là rất cần thiết để bản thân tự tin và cũng là để tạo ấn tượng tốt với mọi người xung quanh",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Bạn có chú ý tới ngoại hình của bản thân?",
                            "type": "E"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn hứng thú với những điều hiện thực, chân thật, giản dị, dễ tiếp xúc và dễ nhận biết hay hứng thú với những triết lý, tư tưởng, công thức và sự lãng mạn?",
                            "optionsList": [{
                                "name": "Tôi hoàn toàn theo trường phái hiện thực. Tôi rất hứng thú với hiện thực, giá trị thực, những điều giản dị và chân thật",
                                "score": "1"
                            }, {
                                "name": "Tôi thiên về trường phái hiện thực",
                                "score": "2"
                            }, {
                                "name": "Tôi thiên về trường phái lãng mạn",
                                "score": "3"
                            }, {
                                "name": "Tôi hoàn toàn theo trường phái lãng mạn. Tôi rất hứng thú với những hệ thống tư tưởng, lý tưởng, đạo đức và triết lý sống khác biệt",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Bạn theo trường phái hiện thực hay lãng mạn?",
                            "type": "N"
                        },
                        {
                            timeLimit: 30,
                            "description": "Những bộ quần áo đẹp nhất của bạn là thuộc loại đồ thể thao, đồ công sở, đồng phục, đồ lịch sự, lịch lãm hay là những bộ đồ phá cách, họa tiết khác thường, khác biệt và thậm chí là dị biệt?",
                            "optionsList": [{
                                "name": "Tôi rất thích những bộ đồ thể thao, đồng phục, áo sơ mi tiêu chuẩn (áo dài), đồ công sở lịch sự, đứng đắn và thanh lịch",
                                "score": "1"
                            }, {
                                "name": "Tôi thiên về gu thời trang thanh lịch",
                                "score": "2"
                            }, {
                                "name": "Tôi thiên về gu thời trang phá cách",
                                "score": "3"
                            }, {
                                "name": "Tôi rất thích những bộ đồ phá cách, khác biệt và dị biệt. Thậm chí áo sơ mi cũng phải có gì đó dị thường",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Gu thời trang của bạn là thanh lịch, lịch lãm hay là dị biệt, phá cách?",
                            "type": "N"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn hứng thú với phong cách nói chuyện rõ ràng, chân thật, trực tiếp và dễ hiểu (thô mà thật) hay bạn hứng thú với các biện pháp nói giảm nói tránh, ngầm hiểu, gián tiếp, ẩn dụ và ám thị?",
                            "optionsList": [{
                                "name": "Tôi rất hứng thú với phong cách nói chuyện rõ ràng, đơn giản, dễ hiểu và dễ nắm bắt",
                                "score": "1"
                            }, {
                                "name": "Tôi thiên về phong cách nói chuyện rõ ràng",
                                "score": "2"
                            }, {
                                "name": "Tôi thiên về phong cách nói chuyện ngầm hiểu",
                                "score": "3"
                            }, {
                                "name": "Tôi rất hứng thú với phong cách nói chuyện ngầm hiểu, thích dành thời gian, công sức tranh luận để mọi thứ được sâu sắc hơn",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Phong cách nói chuyện của bạn là rõ ràng hay ngầm hiểu?",
                            "type": "N"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn hứng thú tham gia các hoạt động thể thao, club nhảy hay hứng thú với việc đọc sách, xem video về tri thức và tham dự hội thảo?",
                            "optionsList": [{
                                "name": "Tôi khá giỏi các hoạt động thể thao, nhảy nhót và không thích những mớ thông tin hỗn độn, khó hiểu",
                                "score": "1"
                            }, {
                                "name": "Tôi là người thích vận động hơn là ngẫm nghĩ",
                                "score": "2"
                            }, {
                                "name": "Tôi là người thích ngẫm nghĩ hơn là vận động",
                                "score": "3"
                            }, {
                                "name": "Tôi đôi khi có thể nhảy hoặc chơi thể thao nhưng đọc sách, xem video tri thức và tham dự hội thảo là những điều rất thú vị",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Bạn thích các hoạt động thể thao hay thích đọc sách?",
                            "type": "N"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn đánh giá cao người có ngoại hình rất đẹp nhưng vẫn giàu có, ga-lăng, quan tâm và chiều chuộng hàng ngày hay người có ngoại hình khá mà có những suy nghĩ khác biệt, ngầm hiểu, lãng mạn, sâu sắc, và đôi chút dị biệt?",
                            "optionsList": [{
                                "name": "Tôi đánh giá cao ngoại hình và sự quan tâm, chiều chuộng thực tế hơn là những suy nghĩ quá sâu sắc, khó hiểu và dị biệt",
                                "score": "1"
                            }, {
                                "name": "Tôi có chút thiên về ngoại hình và sự thực tế hơn",
                                "score": "2"
                            }, {
                                "name": "Tôi có chút thiên về tư duy khác biệt và lãng mạn nhiều hơn",
                                "score": "3"
                            }, {
                                "name": "Tôi đánh giá cao suy nghĩ khác biệt, lãng mạn và ngầm hiểu hơn là ngoại hình đẹp và sự tẻ nhạt",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Bạn thích ngoại hình đẹp, giàu có hay tư duy khác biệt, lãng mạn?",
                            "type": "N"
                        },
                        {
                            timeLimit: 30,
                            "description": "So với đa số những người xung quanh, thì bạn tự đánh giá mình ở loại nào?",
                            "optionsList": [{
                                "name": "Tôi rất dễ giận dỗi, nhưng tôi là người rất bao dung, nên thường sẵn sàng tha thứ ngay sau khi đỡ giận",
                                "score": "1"
                            }, {
                                "name": "Tôi dễ giận dỗi hơn so với đa số bạn bè xung quanh",
                                "score": "2"
                            }, {
                                "name": "Tôi ít khi nổi nóng hơn so với đa số bạn bè xung quanh",
                                "score": "3"
                            }, {
                                "name": "Tôi rất ít khi nổi nóng với ai, nhưng một khi đã nổi nóng thì là vì họ đã phạm phải sai lầm quá nghiêm trọng và khó tha thứ",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Bạn thường dễ giận dỗi, dễ tha thứ hay khó nổi nóng, khó tha thứ?",
                            "type": "T"
                        },
                        {
                            timeLimit: 30,
                            "description": "Mùa hè, bạn có cảm nhận được mình là người phát hiện ra cái nóng sớm nhất và cần nhiều quạt hơn ko? Bạn có cảm thấy mình cần được quan tâm và nhường quạt hơn so với mọi người?",
                            "optionsList": [{
                                "name": "Tôi cảm nhận được nhiệt độ sớm hơn người khác, và cũng cảm thấy mình không chịu được nóng như người khác",
                                "score": "1"
                            }, {
                                "name": "Tôi cảm nhận khá tốt với nhiệt độ môi trường",
                                "score": "2"
                            }, {
                                "name": "Tôi chịu đựng khá tốt với nhiệt độ môi trường",
                                "score": "3"
                            }, {
                                "name": "Tôi thấy mình chịu nóng tốt hơn người khác, và cũng thấy mình không cảm nhận được nhiệt độ như người khác",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Bạn nhạy cảm, nhạy bén hay chịu đựng, trơ lì với nhiệt độ môi trường?",
                            "type": "T"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn tự nhận mình là người có trái tim ấm áp, nhiệt tình giúp đỡ người khác trong lúc khó khăn, quan tâm, chia sẻ, động viên kịp thời hay bạn là người có cái đầu lạnh, chỉ giúp khi thực sự cần thiết và đưa ra lời khuyên hữu ích khi cần?",
                            "optionsList": [{
                                "name": "Tôi cảm thấy mình luôn là người nhiệt tình nhất trong việc cảm nhận, quân tâm và thấu hiểu người khác",
                                "score": "1"
                            }, {
                                "name": "Tôi cảm thấy mình quan tâm và thấu hiểu cảm xúc của người khác khá tốt",
                                "score": "2"
                            }, {
                                "name": "Tôi tự đánh giá mình hơi kém trong việc thể hiện sự quan tâm, chăm sóc người khác",
                                "score": "3"
                            }, {
                                "name": "Tôi không có khả năng quan tâm, thấu hiểu. Nhưng nếu họ thực sự cần, tôi có thể giúp đỡ hoặc đưa ra những lời khuyên hữu dụng",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Bạn có trái tim ấm áp, hay cái đầu lạnh?",
                            "type": "T"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn ấn tượng với giáo viên, giảng viên, diễn giả, linh mục, thiền sư có thể làm cảm động người nghe, hay chỉ cần có sức thuyết phục, logic?",
                            "optionsList": [{
                                "name": "Tôi cảm thấy ấn tượng với những người có thể làm cảm động, rung cảm hàng triệu con tim và khiến cả hội trường phải khóc",
                                "score": "1"
                            }, {
                                "name": "Tôi cảm thấy ấn tượng với sự đồng cảm và thấu hiểu giữa con người với nhau",
                                "score": "2"
                            }, {
                                "name": "Tôi thấy mình có vẻ ấn tượng với sự logic và tính thuyết phục",
                                "score": "3"
                            }, {
                                "name": "Tôi thấy rất ấn tượng với những người có lập luận chặt chẽ, sự logic và tính thuyết phục cao",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Bạn ấn tượng với sự rung cảm hay tính thuyết phục?",
                            "type": "T"
                        },
                        {
                            timeLimit: 30,
                            "description": "So với đại đa số bạn bè và những người xung quanh thì cánh tay bạn có nhiều lông không?",
                            "optionsList": [{
                                "name": "Rất nhiều và dài",
                                "score": "1"
                            }, {
                                "name": "Tương đối nhiều",
                                "score": "2"
                            }, {
                                "name": "Tương đối ít",
                                "score": "3"
                            }, {
                                "name": "Rất ít và gần như không có",
                                "score": "4"
                            }],
                            "score": "4",
                            "name": "Bạn có nhiều lông tay không?",
                            "type": "T"
                        },
                        {
                            timeLimit: 30,
                            "description": "So với đại đa số bạn bè, thì bạn đi nhanh, ăn nhanh, linh hoạt và nhạy bén mà không cần có kế hoạch, hay đi chậm, ăn chậm, điềm tĩnh, điềm đạm lên kế hoạch cho mọi việc?",
                            "optionsList": [{
                                "name": "Tôi luôn đi nhanh, ăn nhanh, hành động nhanh và tự thấy mình rất linh hoạt, nhạy bén mà không cần có kế hoạch",
                                "score": "4"
                            }, {
                                "name": "Tôi khá linh hoạt và nhạy bén",
                                "score": "3"
                            }, {
                                "name": "Tôi khá điềm tĩnh, điềm đạm",
                                "score": "2"
                            }, {
                                "name": "Tôi luôn đi chậm, ăn chậm hành động bình tĩnh và tự thấy mình rất điềm tĩnh, điềm đạm lên kế hoạch cho mọi việc",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Bạn là người linh hoạt và nhạy bén hay điềm tĩnh, điềm đạm?",
                            "type": "J"
                        },
                        {
                            timeLimit: 30,
                            "description": "Khi cùng bạn bè đi chơi, bạn sẽ khuyên mọi người vào khu rừng được biết chắc chắn là sẽ rất thú vị, hay sẽ khuyên mọi người vào một khu rừng cấm và có tin đồn là có thể sẽ thú vị hơn?",
                            "optionsList": [{
                                "name": "Tôi rất liều lĩnh thích khám phá cơ hội ẩn giấu trong sự nguy hiểm",
                                "score": "4"
                            }, {
                                "name": "Tôi thiên về sự nguy hiểm, liều lĩnh và cơ hội",
                                "score": "3"
                            }, {
                                "name": "Tôi thiên về sự an toàn, hiệu quả và chắc chắn",
                                "score": "2"
                            }, {
                                "name": "Tôi hiếm khi đặt cược vào sự liều lĩnh mà không biết chắc chắn sẽ an toàn, hiệu quả và chắc thắng",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Bạn chọn liều lĩnh và cơ hội hay là an toàn và chắc chắn?",
                            "type": "J"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn là người kiên định, chịu trách nhiệm theo đuổi và tuân thủ nguyên tắc, luật chơi tới cùng để đạt thành quả đã định hay là người tinh ranh, có khả năng tìm ra kẽ hở trong luật chơi và phá vỡ để có cơ hội đạt thành quả cao hơn?",
                            "optionsList": [{
                                "name": "Tôi rất nhạy bén, tinh ranh trong việc tìm ra kẽ hở của nguyên tắc, luật chơi",
                                "score": "4"
                            }, {
                                "name": "Tôi thiên về sự tinh ranh, tính nhạy bén",
                                "score": "3"
                            }, {
                                "name": "Tôi thiên về sự kiên định, tính trách nhiệm",
                                "score": "2"
                            }, {
                                "name": "Tôi luôn kiên định, chịu trách nhiệm và tuân thủ nguyên tắc, luật chơi tới cùng",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Bạn là người tinh ranh hay người kiên định?",
                            "type": "J"
                        },
                        {
                            timeLimit: 30,
                            "description": "Bạn có khả năng lên kế hoạch, chịu trách nhiệm hoàn thành đúng hẹn, hay có khả năng chạy nước rút, ứng biến với những thay đổi đột ngột không báo trước làm vỡ kế hoạch?",
                            "optionsList": [{
                                "name": "Tôi rất thích làm việc trong tình trạng khẩn cấp, chạy đua với thời gian, dù đôi lúc có bị trễ hẹn",
                                "score": "4"
                            }, {
                                "name": "Tôi thiên về sự nhanh nhạy và ứng biến",
                                "score": "3"
                            }, {
                                "name": "Tôi thiên về sự trách nhiệm và chữ tín",
                                "score": "2"
                            }, {
                                "name": "Nếu không có những thay đổi quá bất ngờ, thì tôi luôn lên kế hoạch và chịu trách nhiệm hoàn thành đúng hẹn",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Bạn có khả năng thực hiện kế hoạch hay khả năng chạy nước rút?",
                            "type": "J"
                        },
                        {
                            timeLimit: 30,
                            "description": "Tôi rất khó nghĩ ra câu hỏi cuối cùng để hoàn thành đúng kế hoạch đã đặt trước. Bạn sẽ khuyên tôi nên đặt lại câu hỏi khác đúng với tiêu chuẩn MBTI quốc tế, hay sẽ khuyên tôi nên giữ câu hỏi này, vì có thể nó sẽ hiệu quả hơn?",
                            "optionsList": [{
                                "name": "Tôi nghĩ bạn hoàn toàn có thể giữ câu hỏi này, tôi cũng thường xuyên lách luật giống bạn",
                                "score": "4"
                            }, {
                                "name": "Tôi nghĩ bạn có thể giữ câu hỏi này, nếu đáp án vẫn đánh giá tốt về tính cách của tôi",
                                "score": "3"
                            }, {
                                "name": "Tôi khuyên bạn nên cố gắng hoàn thành đúng kế hoạch, tiêu chuẩn định trước",
                                "score": "2"
                            }, {
                                "name": "Chắc chắn là tôi khuyên bạn nghĩ ra câu hỏi đúng và đầy đủ với hệ thống tiêu chuẩn MBTI quốc tế",
                                "score": "1"
                            }],
                            "score": "4",
                            "name": "Tôi có nên đặt lại câu hỏi cuối cùng này?",
                            "type": "J"
                        }
                    ]
                },
                {
                    name: "Name of the template 2",
                    questionsList: [
                        {
                            timeLimit: 30,

                            name: "What do you want to ask 1?",
                            optionsList: [
                                { name: "Here is the option 1 of question 1", score: 1 },
                                { name: "Here is the option 2 of question 1", score: 2 },
                                { name: "Here is the option 3 of question 1", score: 3 },
                                { name: "Here is the option 4 of question 1", score: 4 },
                            ]
                        },
                        {
                            timeLimit: 30,

                            name: "What do you want to ask 2?",
                            optionsList: [
                                { name: "Here is the option 1 of question 2", score: 1 },
                                { name: "Here is the option 2 of question 2", score: 2 },
                                { name: "Here is the option 3 of question 2", score: 3 },
                                { name: "Here is the option 4 of question 2", score: 4 },
                            ]
                        },
                        {
                            timeLimit: 30,

                            name: "What do you want to ask 3?",
                            optionsList: [
                                { name: "Here is the option 1 of question 3", score: 1 },
                                { name: "Here is the option 2 of question 3", score: 1 },
                                { name: "Here is the option 3 of question 3", score: 1 },
                                { name: "Here is the option 4 of question 3", score: 1 },
                            ]
                        }

                    ]
                }
            ]
        }

        this.changeQuizId = this.changeQuizId.bind(this);
        this.changeQuizName = this.changeQuizName.bind(this);
        this.changeQuestionText = this.changeQuestionText.bind(this);
        this.changeOption1 = this.changeOption1.bind(this);
        this.changeOption2 = this.changeOption2.bind(this);
        this.changeOption3 = this.changeOption3.bind(this);
        this.changeOption4 = this.changeOption4.bind(this);
        this.changeCorrectOption = this.changeCorrectOption.bind(this);
    }

    componentDidMount() {

    }

    async createQuiz(quiz) {
        const { state } = this.props;
        this.setState({ creating: true });

        try {
            const tx = await state.HrTest.methods.createQuiz(quiz.name).send();
            console.log(tx);
            if (tx.blockHash) {
                const quizId = tx.events.CreateQuiz.returnValues.quizId;
                this.createQuestion(quizId, quiz);
            }
        } catch (error) {
            console.log(error);

            this.createQuiz(quiz);
        }

    }

    /**
     * Create card
     */
    async createQuestion(quizId, quiz) {
        const { state } = this.props;
        let error = false;
        for (let i = 0; i < quiz.questionsList.length; i++) {
            const question = quiz.questionsList[i];
            const questionName = question.name;

            const maxScore = Math.max(
                question.optionsList[0].score,
                question.optionsList[1].score,
                question.optionsList[2].score,
                question.optionsList[3].score
            );
            const tx = await state.HrTest.methods.createQuestion(
                quizId,
                question.timeLimit,
                [
                    question.optionsList[0].score,
                    question.optionsList[1].score,
                    question.optionsList[2].score,
                    question.optionsList[3].score
                ],
                maxScore,
                questionName,
                question.optionsList[0].name,
                question.optionsList[1].name,
                question.optionsList[2].name,
                question.optionsList[3].name,
            ).send();
            console.log(tx);
            if (!tx.blockHash) {
                error = true;
            }
        }
        if (error === false) {
            window.location = `/board/${quizId}`;
        }
    }


    /**
     * Handle input change
     */
    changeQuizId(e) {
        this.setState({ quizId: e.target.value });
    }
    changeQuizName(e) {
        this.setState({ quizName: e.target.value });
    }
    changeQuestionText(e) {
        this.setState({ questionText: e.target.value });
    }
    changeOption1(e) {
        this.setState({ option1: e.target.value });
    }
    changeOption2(e) {
        this.setState({ option2: e.target.value });
    }
    changeOption3(e) {
        this.setState({ option3: e.target.value });
    }
    changeOption4(e) {
        this.setState({ option4: e.target.value });
    }
    changeCorrectOption(e) {
        this.setState({ correctOption: e.target.value });
    }

    render() {
        const { creating } = this.state;

        return (
            <div className="admin container">
                {/* <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <h1 className="mt-3 text-center">Create Test</h1>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label>QuizId:</label>
                                <input type="number" className="form-control" placeholder="QuizId" value={this.state.quizId} onChange={this.changeQuizId} />
                            </div>
                            <div className="form-group">
                                <label>QuizName:</label>
                                <input type="text" className="form-control" placeholder="Name of the quiz" value={this.state.quizName} onChange={this.changeQuizName} />
                            </div>
                            <div className="form-group">
                                <label>QuestionText:</label>
                                <input type="text" className="form-control" placeholder="What do you want to ask?" value={this.state.questionText} onChange={this.changeQuestionText} />
                            </div>

                            <div className="form-group">
                                <label>Option1:</label>
                                <input type="text" className="form-control" placeholder="Option1" value={this.state.option1} onChange={this.changeOption1} />
                            </div>
                            <div className="form-group">
                                <label>Option2:</label>
                                <input type="text" className="form-control" placeholder="Option2" value={this.state.option2} onChange={this.changeOption2} />
                            </div>
                            <div className="form-group">
                                <label>Option3:</label>
                                <input type="text" className="form-control" placeholder="Option3" value={this.state.option3} onChange={this.changeOption3} />
                            </div>
                            <div className="form-group">
                                <label>Option4:</label>
                                <input type="text" className="form-control" placeholder="Option4" value={this.state.option4} onChange={this.changeOption4} />
                            </div>
                            <div className="form-group">
                                <label>CorrectOption:</label>
                                <input type="number" min="0" max="3" className="form-control" placeholder="CorrectOption" value={this.state.correctOption} onChange={this.changeCorrectOption} />
                            </div>

                            <button className="btn btn-success m-2" onClick={() => this.createQuestion()}>Create Question</button>
                            <button className="btn btn-outline-primary" onClick={() => this.updateQuestion()}>Update Question</button>
                        </form>
                    </div>
                    <div className="col-3"></div>
                </div> */}
                {
                    creating === true &&
                    <div className="row">
                        <div className="text-center mt-5 mx-auto">
                            <div className="loader"></div>
                            Creating Quiz
                        </div>

                    </div>
                }
                {
                    creating === false &&
                    <div className="row">
                        <div className="col">
                            <hr />
                            <h1>Quiz list</h1>

                            <div>
                                {
                                    this.state.quizsList.map((quiz, x) => {
                                        return (
                                            <div key={x} className="card mt-5" onClick={() => this.createQuiz(quiz)}>
                                                <h5>QuizName: {quiz.name}</h5>
                                                <div>
                                                    {
                                                        quiz.questionsList.map((question, y) => {
                                                            return (
                                                                <div key={y} className="mb-3">
                                                                    <b>Question {y + 1}: {question.name}</b>
                                                                    <div>
                                                                        {
                                                                            question.optionsList.map((option, z) => {
                                                                                return (
                                                                                    <div key={z} style={{ 'background': z === question.correctOption ? '#f1f1f1' : "" }}>
                                                                                        {option.name}
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }

                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                }


            </div>
        );
    }
}

export default DefaultName = connect(
    (state) => {
        return { state };
    },
    (dispatch) => {
        return { dispatch };
    },
)(DefaultName);